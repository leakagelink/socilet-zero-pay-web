import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM_EMAIL = "Socilet <hello@socilet.in>";

interface EmailRequest {
  to: string;
  toName?: string;
  subject: string;
  message: string;
  replyTo?: string;
}

const getEmailHtml = (recipientName: string, message: string) => {
  // Convert newlines to <br> for HTML
  const formattedMessage = message.replace(/\n/g, '<br>');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message from Socilet</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
              <img src="https://knputxpnhffskshlakiq.supabase.co/storage/v1/object/public/email-assets/socilet-logo.png?v=1" alt="Socilet" style="height: 60px; margin-bottom: 16px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Socilet</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Web & App Development Agency</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">
                Hello${recipientName ? ` ${recipientName}` : ''},
              </h2>
              
              <div style="color: #374151; font-size: 15px; line-height: 1.7;">
                ${formattedMessage}
              </div>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Best regards,<br>
                  <strong style="color: #111827;">Team Socilet</strong>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <div style="margin-bottom: 16px;">
                <a href="https://socilet.in" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  Visit Our Website
                </a>
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                📧 hello@socilet.in | 🌐 www.socilet.in
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} Socilet. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Send manual email function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      throw new Error('Admin access required');
    }

    const body: EmailRequest = await req.json();
    const { to, toName, subject, message, replyTo } = body;

    if (!to || !subject || !message) {
      throw new Error('Missing required fields: to, subject, message');
    }

    console.log('Sending email to:', to);

    const emailOptions: any = {
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      html: getEmailHtml(toName || '', message),
    };

    if (replyTo) {
      emailOptions.replyTo = replyTo;
    }

    const emailResponse = await resend.emails.send(emailOptions);

    console.log('Email sent:', emailResponse);

    // Log the email using service role for RLS bypass
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseAdmin.from('email_logs').insert({
      email_type: 'manual',
      recipient_email: to,
      recipient_name: toName || null,
      subject: subject,
      body_preview: message.substring(0, 200),
      status: 'sent',
      sent_by: user.id,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-manual-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.message === 'Unauthorized' || error.message === 'Admin access required' ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
