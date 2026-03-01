import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM_EMAIL = "Socilet <hello@socilet.in>";

interface PaymentUpdateRequest {
  clientEmail: string;
  clientName: string;
  projectName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getPaymentEmailHtml = (data: PaymentUpdateRequest) => {
  const { clientName, projectName, totalAmount, paidAmount, remainingAmount } = data;
  const paidPercentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received - Socilet</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
              <img src="https://knputxpnhffskshlakiq.supabase.co/storage/v1/object/public/email-assets/socilet-logo.png?v=2" alt="Socilet" style="height: 70px; margin-bottom: 12px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Payment Received ✅</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Thank you for your payment!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">
                Hello ${clientName},
              </h2>
              
              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                We have received your payment for the project <strong>"${projectName}"</strong>. Below is the summary of your payment status:
              </p>

              <!-- Payment Summary Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Project Name</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${projectName}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-bottom: 1px solid #e5e7eb;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Project Cost</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${formatCurrency(totalAmount)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-bottom: 1px solid #e5e7eb;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #059669; font-size: 14px; font-weight: 500;">✅ Amount Paid</td>
                        <td style="padding: 8px 0; color: #059669; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(paidAmount)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-bottom: 1px solid #e5e7eb;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 500;">⏳ Remaining Amount</td>
                        <td style="padding: 8px 0; color: #dc2626; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(remainingAmount)}</td>
                      </tr>
                    </table>

                    <!-- Progress Bar -->
                    <div style="margin-top: 16px;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #6b7280; font-size: 12px;">Payment Progress</span>
                        <span style="color: #6366f1; font-size: 12px; font-weight: 600;">${paidPercentage}%</span>
                      </div>
                      <div style="background-color: #e5e7eb; border-radius: 999px; height: 8px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); height: 100%; width: ${paidPercentage}%; border-radius: 999px;"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 24px 0 0 0;">
                ${remainingAmount > 0 
                  ? `Your remaining balance of <strong>${formatCurrency(remainingAmount)}</strong> will be due as per the agreed payment terms. We will keep you updated on your project progress.`
                  : `🎉 Congratulations! Your payment is complete. Thank you for your trust in Socilet!`
                }
              </p>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  If you have any questions, feel free to reach out to us.<br><br>
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
  console.log('Payment update email function called');

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

    const body: PaymentUpdateRequest = await req.json();
    const { clientEmail, clientName, projectName, totalAmount, paidAmount, remainingAmount } = body;

    if (!clientEmail || !clientName || !projectName) {
      throw new Error('Missing required fields: clientEmail, clientName, projectName');
    }

    console.log('Sending payment update email to:', clientEmail);

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [clientEmail],
      subject: `💰 Payment Received - ${projectName} | Socilet`,
      html: getPaymentEmailHtml(body),
    });

    console.log('Payment email sent:', emailResponse);

    // Log the email
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseAdmin.from('email_logs').insert({
      email_type: 'payment_update',
      recipient_email: clientEmail,
      recipient_name: clientName,
      subject: `Payment Received - ${projectName}`,
      body_preview: `Payment of ${formatCurrency(paidAmount)} received. Remaining: ${formatCurrency(remainingAmount)}`,
      status: 'sent',
      sent_by: user.id,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Payment update email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in payment-update-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.message === 'Unauthorized' || error.message === 'Admin access required' ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
