import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature',
};

// Parse email address to extract name and email
const parseEmailAddress = (rawFrom: string): { name: string | null; email: string } => {
  if (!rawFrom) return { name: null, email: '' };
  
  // Try format: "Display Name <email@domain.com>" or Display Name <email@domain.com>
  const angleMatch = rawFrom.match(/^(.+?)\s*<([^>]+)>$/);
  if (angleMatch) {
    const displayName = angleMatch[1].replace(/^["']|["']$/g, '').trim();
    return {
      name: displayName || null,
      email: angleMatch[2].trim()
    };
  }
  
  // Try format: <email@domain.com>
  const justAngle = rawFrom.match(/^<([^>]+)>$/);
  if (justAngle) {
    return { name: null, email: justAngle[1].trim() };
  }
  
  // Plain email address
  if (rawFrom.includes('@')) {
    return { name: null, email: rawFrom.trim() };
  }
  
  return { name: null, email: rawFrom.trim() };
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Resend inbound webhook received');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Webhook payload type:', payload.type);
    
    if (payload.type !== 'email.received') {
      console.log('Not an inbound email event, skipping');
      return new Response(
        JSON.stringify({ message: 'Event type not handled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const eventData = payload.data;
    const emailId = eventData.email_id;
    console.log('Processing inbound email, email_id:', emailId);

    // Parse sender info from webhook data
    const sender = parseEmailAddress(eventData.from || '');
    const toEmail = Array.isArray(eventData.to) ? eventData.to[0] : eventData.to;

    // Resend webhook does NOT include body - must fetch via Receiving API
    let textBody: string | null = null;
    let htmlBody: string | null = null;
    let headers: any = null;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey && emailId) {
      try {
        console.log('Fetching email content via Receiving API...');
        const emailResponse = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
          },
        });

        if (emailResponse.ok) {
          const fullEmail = await emailResponse.json();
          console.log('Full email fetched, keys:', Object.keys(fullEmail));
          textBody = fullEmail.text || null;
          htmlBody = fullEmail.html || null;
          headers = fullEmail.headers || null;
          console.log('Text body length:', textBody?.length || 0);
          console.log('HTML body length:', htmlBody?.length || 0);
        } else {
          const errText = await emailResponse.text();
          console.error('Receiving API error:', emailResponse.status, errText);
        }
      } catch (fetchError) {
        console.error('Error fetching email content:', fetchError);
      }
    } else {
      console.warn('Missing RESEND_API_KEY or email_id');
    }

    // Create Supabase client with service role
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
        to_email: toEmail || '',
        subject: eventData.subject || '(No Subject)',
        text_body: textBody,
        html_body: htmlBody,
        headers: headers,
        attachments: null,
        received_at: eventData.created_at || new Date().toISOString(),
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
