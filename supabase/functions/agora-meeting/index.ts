import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Agora Credentials
const AGORA_APP_ID = '70055c1865ad4462bd0a92cb610707be';
const AGORA_APP_CERTIFICATE = '2e1cbfe2c6e1407f8a49a21f3d706b14';

// RTC Token Builder for Agora
class RtcTokenBuilder {
  private static VERSION = "007";
  private static VERSION_LENGTH = 3;
  
  private static PRIVILEGES = {
    kJoinChannel: 1,
    kPublishAudioStream: 2,
    kPublishVideoStream: 3,
    kPublishDataStream: 4,
  };

  static async buildTokenWithUid(
    appId: string,
    appCertificate: string,
    channelName: string,
    uid: number,
    role: number,
    tokenExpire: number,
    privilegeExpire: number
  ): Promise<string> {
    return await this.buildTokenWithUserAccount(
      appId,
      appCertificate,
      channelName,
      uid.toString(),
      role,
      tokenExpire,
      privilegeExpire
    );
  }

  static async buildTokenWithUserAccount(
    appId: string,
    appCertificate: string,
    channelName: string,
    account: string,
    role: number,
    tokenExpire: number,
    privilegeExpire: number
  ): Promise<string> {
    const token = new AccessToken(appId, appCertificate, tokenExpire);
    const serviceRtc = new ServiceRtc(channelName, account);
    
    serviceRtc.addPrivilege(this.PRIVILEGES.kJoinChannel, privilegeExpire);
    
    if (role === 1) { // Publisher
      serviceRtc.addPrivilege(this.PRIVILEGES.kPublishAudioStream, privilegeExpire);
      serviceRtc.addPrivilege(this.PRIVILEGES.kPublishVideoStream, privilegeExpire);
      serviceRtc.addPrivilege(this.PRIVILEGES.kPublishDataStream, privilegeExpire);
    }
    
    token.addService(serviceRtc);
    return await token.build();
  }
}

class AccessToken {
  private appId: string;
  private appCertificate: string;
  private expire: number;
  private salt: number;
  private ts: number;
  private services: Map<number, Service> = new Map();

  constructor(appId: string, appCertificate: string, expire: number) {
    this.appId = appId;
    this.appCertificate = appCertificate;
    this.expire = expire;
    this.salt = Math.floor(Math.random() * 0xFFFFFFFF);
    this.ts = Math.floor(Date.now() / 1000);
  }

  addService(service: Service) {
    this.services.set(service.getServiceType(), service);
  }

  async build(): Promise<string> {
    const signing = await this.getSign();
    
    const encoder = new TextEncoder();
    
    // Build content
    let content = new Uint8Array(0);
    content = this.concat(content, this.packUint32(this.ts));
    content = this.concat(content, this.packUint32(this.salt));
    content = this.concat(content, this.packUint32(this.expire));
    content = this.concat(content, this.packUint16(this.services.size));
    
    this.services.forEach((service) => {
      content = this.concat(content, service.pack());
    });
    
    const signature = await this.hmacSha256(signing, content);
    
    let data = new Uint8Array(0);
    data = this.concat(data, this.packString(this.uint8ArrayToString(signature)));
    data = this.concat(data, content);
    
    const compressed = this.compress(data);
    const base64 = this.base64Encode(compressed);
    
    return "007" + this.base64Encode(this.compress(encoder.encode(this.appId))) + base64;
  }

  private async getSign(): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const data = encoder.encode(this.appCertificate);
    const salt = encoder.encode(this.salt.toString().padStart(10, '0'));
    return await this.hmacSha256(data, salt);
  }

  private async hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
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

  private packUint16(value: number): Uint8Array {
    return new Uint8Array([value & 0xFF, (value >> 8) & 0xFF]);
  }

  private packUint32(value: number): Uint8Array {
    return new Uint8Array([
      value & 0xFF,
      (value >> 8) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 24) & 0xFF
    ]);
  }

  private packString(str: string): Uint8Array {
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const lenBytes = this.packUint16(strBytes.length);
    return this.concat(lenBytes, strBytes);
  }

  private concat(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }

  private compress(data: Uint8Array): Uint8Array {
    // For now, return uncompressed data with marker
    return data;
  }

  private base64Encode(data: Uint8Array): string {
    return btoa(String.fromCharCode(...data));
  }

  private uint8ArrayToString(data: Uint8Array): string {
    return String.fromCharCode(...data);
  }
}

class Service {
  protected serviceType: number;
  protected privileges: Map<number, number> = new Map();

  constructor(serviceType: number) {
    this.serviceType = serviceType;
  }

  getServiceType(): number {
    return this.serviceType;
  }

  addPrivilege(privilege: number, expire: number) {
    this.privileges.set(privilege, expire);
  }

  pack(): Uint8Array {
    return new Uint8Array(0);
  }

  protected packUint16(value: number): Uint8Array {
    return new Uint8Array([value & 0xFF, (value >> 8) & 0xFF]);
  }

  protected packUint32(value: number): Uint8Array {
    return new Uint8Array([
      value & 0xFF,
      (value >> 8) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 24) & 0xFF
    ]);
  }

  protected packString(str: string): Uint8Array {
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const lenBytes = this.packUint16(strBytes.length);
    return this.concat(lenBytes, strBytes);
  }

  protected packMapUint32(): Uint8Array {
    let result = this.packUint16(this.privileges.size);
    this.privileges.forEach((value, key) => {
      result = this.concat(result, this.packUint16(key));
      result = this.concat(result, this.packUint32(value));
    });
    return result;
  }

  protected concat(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }
}

class ServiceRtc extends Service {
  private channelName: string;
  private uid: string;

  constructor(channelName: string, uid: string) {
    super(1); // RTC Service type
    this.channelName = channelName;
    this.uid = uid;
  }

  pack(): Uint8Array {
    let result = this.packUint16(this.serviceType);
    result = this.concat(result, this.packMapUint32());
    result = this.concat(result, this.packString(this.channelName));
    result = this.concat(result, this.packString(this.uid));
    return result;
  }
}

// Simple token approach - using Agora's simple token (for testing mode fallback)
async function generateSimpleToken(
  appId: string,
  appCertificate: string,
  channelName: string,
  uid: number | string,
  expireSeconds: number
): Promise<string> {
  const currentTs = Math.floor(Date.now() / 1000);
  const expireTs = currentTs + expireSeconds;
  const randomInt = Math.floor(Math.random() * 0xFFFFFFFF);
  
  const encoder = new TextEncoder();
  
  // Create message
  const uidStr = uid.toString();
  const toSign = `${appId}${channelName}${uidStr}${expireTs}${randomInt}`;
  
  // HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appCertificate),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(toSign));
  const sigHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Pack token data
  const tokenPayload = {
    appId,
    channelName,
    uid: uidStr,
    expireTs,
    salt: randomInt,
    signature: sigHex
  };
  
  return "006" + appId + btoa(JSON.stringify(tokenPayload));
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
      const userUid = uid || 0;
      const tokenExpireSeconds = 3600; // 1 hour
      const privilegeExpireSeconds = 3600;
      
      console.log(`Generating token for channel: ${channel}, uid: ${userUid}`);
      console.log(`Using App ID: ${AGORA_APP_ID}`);
      
      try {
        // Try the AccessToken2 approach
        const token = await RtcTokenBuilder.buildTokenWithUid(
          AGORA_APP_ID,
          AGORA_APP_CERTIFICATE,
          channel,
          userUid,
          1, // Role: Publisher
          tokenExpireSeconds,
          privilegeExpireSeconds
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
      } catch (tokenError) {
        console.error('Token generation error:', tokenError);
        
        // Fallback to simple token
        const simpleToken = await generateSimpleToken(
          AGORA_APP_ID,
          AGORA_APP_CERTIFICATE,
          channel,
          userUid,
          tokenExpireSeconds
        );
        
        console.log(`Simple token generated as fallback`);
        
        return new Response(
          JSON.stringify({
            success: true,
            token: simpleToken,
            appId: AGORA_APP_ID,
            channelName: channel,
            uid: userUid,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
