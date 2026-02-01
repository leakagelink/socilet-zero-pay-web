import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agora Credentials
const AGORA_APP_ID = '70055c1865ad4462bd0a92cb610707be';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, roomName, title, description, createdBy } = await req.json();
    console.log(`Action: ${action}, Room: ${roomName}`);

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
