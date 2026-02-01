import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { RtcTokenBuilder, RtcRole } from "npm:agora-token@2.0.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Agora Credentials
const AGORA_APP_ID = '70055c1865ad4462bd0a92cb610707be';
const AGORA_APP_CERTIFICATE = '2e1cbfe2c6e1407f8a49a21f3d706b14';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, roomName, title, description, createdBy, channelName: reqChannelName, uid, projectWorkspaceId } = await req.json();
    console.log(`Action: ${action}, Room: ${roomName || reqChannelName}, Workspace: ${projectWorkspaceId || 'none'}`);

    if (action === 'generate-token') {
      const channel = reqChannelName || roomName;
      const userUid = uid || 0;
      const role = RtcRole.PUBLISHER;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTime + 3600; // 1 hour
      
      console.log(`Generating token for channel: ${channel}, uid: ${userUid}`);
      console.log(`Using App ID: ${AGORA_APP_ID}`);
      
      // Use official Agora token builder
      const token = RtcTokenBuilder.buildTokenWithUid(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channel,
        userUid,
        role,
        privilegeExpireTime,
        privilegeExpireTime
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
      
      const meetingInsert: Record<string, unknown> = {
        room_name: channelName,
        room_url: channelName,
        title: title || 'New Meeting',
        description: description || '',
        created_by: createdBy || 'Anonymous',
        is_active: true,
      };
      
      // Add workspace link if provided
      if (projectWorkspaceId) {
        meetingInsert.project_workspace_id = projectWorkspaceId;
      }
      
      const { data: meetingData, error: dbError } = await supabase
        .from('meetings')
        .insert(meetingInsert)
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
        .select('*, chat_rooms(*), project_workspaces(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch meetings: ${error.message}`);
      }

      // Flatten workspace info
      const formattedMeetings = meetings?.map((m: any) => ({
        ...m,
        project_workspace_id: m.project_workspace_id,
        project_code: m.project_workspaces?.project_code || null,
      }));

      return new Response(
        JSON.stringify({ 
          success: true, 
          meetings: formattedMeetings,
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
