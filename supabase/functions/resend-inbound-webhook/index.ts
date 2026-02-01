import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature',
};

interface ResendInboundEmail {
  from: string;
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>[];
  attachments?: Array<{
    filename: string;
    content_type: string;
    content: string;
  }>;
}

// Parse email address to extract name and email
const parseEmailAddress = (email: string): { name: string | null; email: string } => {
  // Format: "Name <email@example.com>" or just "email@example.com"
  const match = email.match(/^(?:"?([^"]*)"?\s*)?<?([^>]+)>?$/);
  if (match) {
    return {
      name: match[1]?.trim() || null,
      email: match[2]?.trim() || email
    };
  }
  return { name: null, email: email };
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Resend inbound webhook received');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse the incoming webhook payload
    const payload = await req.json();
    console.log('Webhook payload type:', payload.type);
    
    // Resend sends events with type field
    if (payload.type !== 'email.received') {
      console.log('Not an inbound email event, skipping');
      return new Response(
        JSON.stringify({ message: 'Event type not handled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailData: ResendInboundEmail = payload.data;
    console.log('Processing inbound email from:', emailData.from, 'to:', emailData.to);

    // Parse sender info
    const sender = parseEmailAddress(emailData.from);

    // Create Supabase client with service role for inserting
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert the inbound email
    const { data, error } = await supabaseAdmin
      .from('inbound_emails')
      .insert({
        from_email: sender.email,
        from_name: sender.name,
        to_email: emailData.to,
        subject: emailData.subject || '(No Subject)',
        text_body: emailData.text || null,
        html_body: emailData.html || null,
        headers: emailData.headers || null,
        attachments: emailData.attachments ? JSON.stringify(emailData.attachments) : null,
        received_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting inbound email:', error);
      throw error;
    }

    console.log('Inbound email stored successfully:', data.id);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in resend-inbound-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
