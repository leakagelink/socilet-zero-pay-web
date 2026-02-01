import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agora Credentials
const AGORA_APP_ID = '70055c1865ad4462bd0a92cb610707be';
const AGORA_APP_CERTIFICATE = '2e1cbfe2c6e1407f8a49a21f3d706b14';

// Token generation helpers
const VERSION = "007";
const VERSION_LENGTH = 3;

const PRIVILEGES = {
  kJoinChannel: 1,
  kPublishAudioStream: 2,
  kPublishVideoStream: 3,
  kPublishDataStream: 4,
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// Base64 encoding
function base64Encode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data));
}

// CRC32 implementation
function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Pack functions
function packUint16(value: number): Uint8Array {
  return new Uint8Array([value & 0xFF, (value >> 8) & 0xFF]);
}

function packUint32(value: number): Uint8Array {
  return new Uint8Array([
    value & 0xFF,
    (value >> 8) & 0xFF,
    (value >> 16) & 0xFF,
    (value >> 24) & 0xFF
  ]);
}

function packString(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const strBytes = encoder.encode(str);
  const lenBytes = packUint16(strBytes.length);
  const result = new Uint8Array(lenBytes.length + strBytes.length);
  result.set(lenBytes);
  result.set(strBytes, lenBytes.length);
  return result;
}

function packMapUint32(map: Map<number, number>): Uint8Array {
  const parts: Uint8Array[] = [];
  parts.push(packUint16(map.size));
  
  map.forEach((value, key) => {
    parts.push(packUint16(key));
    parts.push(packUint32(value));
  });
  
  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  parts.forEach(p => {
    result.set(p, offset);
    offset += p.length;
  });
  
  return result;
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach(arr => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
}

async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return new Uint8Array(signature);
}

async function generateAccessToken(
  appId: string,
  appCertificate: string,
  channelName: string,
  uid: number,
  role: number,
  privilegeExpiredTs: number
): Promise<string> {
  const encoder = new TextEncoder();
  
  // Create privileges map
  const privileges = new Map<number, number>();
  privileges.set(PRIVILEGES.kJoinChannel, privilegeExpiredTs);
  privileges.set(PRIVILEGES.kPublishAudioStream, privilegeExpiredTs);
  privileges.set(PRIVILEGES.kPublishVideoStream, privilegeExpiredTs);
  privileges.set(PRIVILEGES.kPublishDataStream, privilegeExpiredTs);
  
  // Generate salt and ts
  const salt = randomInt(1, 99999999);
  const ts = getTimestamp();
  
  // Build message
  const message = concatUint8Arrays(
    packUint32(salt),
    packUint32(ts),
    packMapUint32(privileges)
  );
  
  // Build signature message
  const signMessage = concatUint8Arrays(
    encoder.encode(appId),
    encoder.encode(channelName),
    packUint32(uid),
    message
  );
  
  // Generate signature
  const signature = await hmacSha256(encoder.encode(appCertificate), signMessage);
  
  // Build content
  const content = concatUint8Arrays(
    packString(signature.reduce((str, byte) => str + String.fromCharCode(byte), '')),
    packUint32(crc32(encoder.encode(channelName))),
    packUint32(crc32(message)),
    message
  );
  
  // Final token
  const token = VERSION + appId + base64Encode(content);
  
  return token;
}

// Simple RTC Token Builder using simpler approach
async function buildTokenWithUid(
  appId: string,
  appCertificate: string, 
  channelName: string,
  uid: number,
  tokenExpireSeconds: number
): Promise<string> {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + tokenExpireSeconds;
  
  // For RTC tokens, we use a simpler approach
  const encoder = new TextEncoder();
  
  // Create the base string to sign
  const uidStr = uid === 0 ? '' : uid.toString();
  const toSign = `${appId}${channelName}${uidStr}${privilegeExpiredTs}`;
  
  // Sign with HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appCertificate),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(toSign));
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Build token parts
  const tokenData = {
    appId,
    channelName,
    uid: uidStr,
    expire: privilegeExpiredTs,
    signature: signatureHex
  };
  
  // Encode token
  const tokenJson = JSON.stringify(tokenData);
  const tokenBase64 = btoa(tokenJson);
  
  return `007${appId}${tokenBase64}`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, roomName, title, description, createdBy, channelName: reqChannelName, uid } = await req.json();
    console.log(`Action: ${action}, Room: ${roomName}`);

    if (action === 'generate-token') {
      // Generate RTC token for joining a channel
      const channel = reqChannelName || roomName;
      const userUid = uid || 0;
      const tokenExpireSeconds = 3600; // 1 hour
      
      console.log(`Generating token for channel: ${channel}, uid: ${userUid}`);
      
      // Use Agora's official token algorithm
      const privilegeExpiredTs = Math.floor(Date.now() / 1000) + tokenExpireSeconds;
      
      // Build RTC token using RtcTokenBuilder approach
      const token = await generateRtcToken(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channel,
        userUid,
        1, // Role: Publisher
        privilegeExpiredTs
      );
      
      return new Response(
        JSON.stringify({
          success: true,
          token,
          appId: AGORA_APP_ID,
          channelName: channel,
          uid: userUid,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'create-room') {
      // Generate a unique channel name for Agora
      const channelName = roomName || `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store meeting in database
      const { data: meetingData, error: dbError } = await supabase
        .from('meetings')
        .insert({
          room_name: channelName,
          room_url: channelName, // For Agora, we use channel name as the "URL"
          title: title || 'New Meeting',
          description: description || '',
          created_by: createdBy || 'Anonymous',
          is_active: true,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Failed to save meeting: ${dbError.message}`);
      }

      // Create associated chat room
      const { data: chatRoom, error: chatError } = await supabase
        .from('chat_rooms')
        .insert({
          name: `Chat - ${title || 'New Meeting'}`,
          description: `Chat room for meeting: ${title || 'New Meeting'}`,
          meeting_id: meetingData.id,
          is_public: true,
        })
        .select()
        .single();

      if (chatError) {
        console.error('Chat room creation error:', chatError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          meeting: meetingData,
          chatRoom: chatRoom,
          appId: AGORA_APP_ID,
          channelName: channelName,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete-room') {
      // Update meeting status in database
      const { error: dbError } = await supabase
        .from('meetings')
        .update({ is_active: false })
        .eq('room_name', roomName);

      if (dbError) {
        console.error('Database update error:', dbError);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Room deleted' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get-rooms') {
      // Fetch all active meetings
      const { data: meetings, error } = await supabase
        .from('meetings')
        .select('*, chat_rooms(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch meetings: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          meetings,
          appId: AGORA_APP_ID,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get-app-id') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          appId: AGORA_APP_ID,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Agora RTC Token generation (RtcTokenBuilder007)
async function generateRtcToken(
  appId: string,
  appCertificate: string,
  channelName: string,
  uid: number,
  role: number,
  privilegeExpiredTs: number
): Promise<string> {
  const encoder = new TextEncoder();
  
  // Generate random salt
  const salt = randomInt(1, 0xFFFFFFFF);
  const ts = Math.floor(Date.now() / 1000);
  
  // Build privileges
  const privileges = new Map<number, number>();
  privileges.set(PRIVILEGES.kJoinChannel, privilegeExpiredTs);
  if (role === 1) { // Publisher
    privileges.set(PRIVILEGES.kPublishAudioStream, privilegeExpiredTs);
    privileges.set(PRIVILEGES.kPublishVideoStream, privilegeExpiredTs);
    privileges.set(PRIVILEGES.kPublishDataStream, privilegeExpiredTs);
  }
  
  // Pack message
  const messageParts: Uint8Array[] = [];
  messageParts.push(packUint32(salt));
  messageParts.push(packUint32(ts));
  messageParts.push(packMapUint32(privileges));
  
  const message = concatUint8Arrays(...messageParts);
  
  // Build content to sign
  const uidBytes = packUint32(uid);
  const channelBytes = encoder.encode(channelName);
  const appIdBytes = encoder.encode(appId);
  
  const toSign = concatUint8Arrays(appIdBytes, channelBytes, uidBytes, message);
  
  // HMAC-SHA256 signature
  const signature = await hmacSha256(encoder.encode(appCertificate), toSign);
  
  // Pack signature as string
  const sigStr = Array.from(signature).map(b => String.fromCharCode(b)).join('');
  const packedSig = packString(sigStr);
  
  // Calculate CRC32 values
  const channelCrc = crc32(channelBytes);
  const uidCrc = crc32(uidBytes);
  
  // Build final content
  const content = concatUint8Arrays(
    packedSig,
    packUint32(channelCrc),
    packUint32(uidCrc),
    message
  );
  
  // Base64 encode and build token
  const base64Content = base64Encode(content);
  
  return VERSION + appId + base64Content;
}