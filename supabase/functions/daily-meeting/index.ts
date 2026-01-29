import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_API_URL = 'https://api.daily.co/v1';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const DAILY_API_KEY = Deno.env.get('DAILY_API_KEY');
    if (!DAILY_API_KEY) {
      console.error('DAILY_API_KEY not configured');
      throw new Error('Daily.co API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, roomName, title, description, createdBy } = await req.json();
    console.log(`Action: ${action}, Room: ${roomName}`);

    if (action === 'create-room') {
      // Create a Daily.co room
      const roomResponse = await fetch(`${DAILY_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            enable_chat: true,
            enable_screenshare: true,
            enable_knocking: false,
            start_video_off: false,
            start_audio_off: false,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours expiry
          },
        }),
      });

      if (!roomResponse.ok) {
        const errorData = await roomResponse.text();
        console.error('Daily.co room creation failed:', errorData);
        throw new Error(`Failed to create Daily.co room: ${errorData}`);
      }

      const roomData = await roomResponse.json();
      console.log('Daily.co room created:', roomData);

      // Store meeting in database
      const { data: meetingData, error: dbError } = await supabase
        .from('meetings')
        .insert({
          room_name: roomData.name,
          room_url: roomData.url,
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
          roomUrl: roomData.url,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete-room') {
      // Delete Daily.co room
      const deleteResponse = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
        },
      });

      if (!deleteResponse.ok) {
        console.error('Failed to delete Daily.co room');
      }

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
        JSON.stringify({ success: true, meetings }),
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
