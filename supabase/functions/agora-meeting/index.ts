import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Agora Credentials
const AGORA_APP_ID = '70055c1865ad4462bd0a92cb610707be';
const AGORA_APP_CERTIFICATE = '2e1cbfe2c6e1407f8a49a21f3d706b14';

// Role constants
const Role = {
  PUBLISHER: 1,
  SUBSCRIBER: 2,
};

// Privilege constants
const Privileges = {
  kJoinChannel: 1,
  kPublishAudioStream: 2,
  kPublishVideoStream: 3,
  kPublishDataStream: 4,
};

// Pack functions
function packUint16(val: number): Uint8Array {
  const buf = new Uint8Array(2);
  buf[0] = val & 0xff;
  buf[1] = (val >>> 8) & 0xff;
  return buf;
}

function packUint32(val: number): Uint8Array {
  const buf = new Uint8Array(4);
  buf[0] = val & 0xff;
  buf[1] = (val >>> 8) & 0xff;
  buf[2] = (val >>> 16) & 0xff;
  buf[3] = (val >>> 24) & 0xff;
  return buf;
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

function packContent(salt: number, ts: number, privileges: Map<number, number>): Uint8Array {
  let offset = 0;
  const buffer = new Uint8Array(1024);
  
  // Pack salt
  const saltBytes = packUint32(salt);
  buffer.set(saltBytes, offset);
  offset += saltBytes.length;
  
  // Pack ts
  const tsBytes = packUint32(ts);
  buffer.set(tsBytes, offset);
  offset += tsBytes.length;
  
  // Pack privileges size
  const sizeBytes = packUint16(privileges.size);
  buffer.set(sizeBytes, offset);
  offset += sizeBytes.length;
  
  // Pack privileges
  privileges.forEach((value, key) => {
    const keyBytes = packUint16(key);
    buffer.set(keyBytes, offset);
    offset += keyBytes.length;
    
    const valueBytes = packUint32(value);
    buffer.set(valueBytes, offset);
    offset += valueBytes.length;
  });
  
  return buffer.slice(0, offset);
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

function base64Encode(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

async function generateToken(
  appId: string,
  appCertificate: string,
  channelName: string,
  uid: string,
  role: number,
  privilegeExpiredTs: number
): Promise<string> {
  const encoder = new TextEncoder();
  
  const ts = Math.floor(Date.now() / 1000);
  const salt = Math.floor(Math.random() * 0xFFFFFFFF);
  
  // Build privileges map
  const privileges = new Map<number, number>();
  privileges.set(Privileges.kJoinChannel, privilegeExpiredTs);
  
  if (role === Role.PUBLISHER) {
    privileges.set(Privileges.kPublishAudioStream, privilegeExpiredTs);
    privileges.set(Privileges.kPublishVideoStream, privilegeExpiredTs);
    privileges.set(Privileges.kPublishDataStream, privilegeExpiredTs);
  }
  
  // Pack message
  const message = packContent(salt, ts, privileges);
  
  // Generate signature
  const toSign = new Uint8Array([
    ...encoder.encode(appId),
    ...encoder.encode(channelName),
    ...encoder.encode(uid),
    ...message,
  ]);
  
  const sign = await hmacSha256(encoder.encode(appCertificate), toSign);
  
  // Build content buffer
  const contentBuffer = new Uint8Array(1024);
  let offset = 0;
  
  // Pack signature
  const signStr = packString(base64Encode(sign));
  contentBuffer.set(signStr, offset);
  offset += signStr.length;
  
  // Pack crc channel
  const crcChannel = crc32(encoder.encode(channelName));
  const crcChannelBytes = packUint32(crcChannel);
  contentBuffer.set(crcChannelBytes, offset);
  offset += crcChannelBytes.length;
  
  // Pack crc uid
  const crcUid = crc32(encoder.encode(uid));
  const crcUidBytes = packUint32(crcUid);
  contentBuffer.set(crcUidBytes, offset);
  offset += crcUidBytes.length;
  
  // Pack message
  const msgStr = packString(base64Encode(message));
  contentBuffer.set(msgStr, offset);
  offset += msgStr.length;
  
  const content = contentBuffer.slice(0, offset);
  
  // Build final token
  const version = "006";
  return version + appId + base64Encode(content);
}

// CRC32 implementation
function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  const table = getCrc32Table();
  
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getCrc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc = crc >>> 1;
      }
    }
    table[i] = crc >>> 0;
  }
  
  return table;
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
    console.log(`Action: ${action}, Room: ${roomName || reqChannelName}`);

    if (action === 'generate-token') {
      const channel = reqChannelName || roomName;
      const userUid = uid?.toString() || '0';
      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTime + 3600; // 1 hour
      
      console.log(`Generating token for channel: ${channel}, uid: ${userUid}`);
      console.log(`Using App ID: ${AGORA_APP_ID}`);
      
      const token = await generateToken(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channel,
        userUid,
        Role.PUBLISHER,
        privilegeExpiredTs
      );
      
      console.log(`Token generated successfully (length: ${token.length})`);
      
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
      const channelName = roomName || `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: meetingData, error: dbError } = await supabase
        .from('meetings')
        .insert({
          room_name: channelName,
          room_url: channelName,
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
