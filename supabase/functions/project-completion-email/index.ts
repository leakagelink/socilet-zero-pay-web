import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM_EMAIL = "Socilet <hello@socilet.in>";

interface CompletionEmailRequest {
  clientEmail: string;
  clientName: string;
  projectName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  startDate?: string;
  endDate?: string;
  deadline?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getCompletionEmailHtml = (data: CompletionEmailRequest) => {
  const { clientName, projectName, totalAmount, paidAmount, remainingAmount, startDate, endDate, deadline } = data;
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  const formattedDeadline = formatDate(deadline);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Completed - Socilet</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px; text-align: center;">
              <img src="https://knputxpnhffskshlakiq.supabase.co/storage/v1/object/public/email-assets/socilet-logo.png?v=2" alt="Socilet" style="height: 70px; margin-bottom: 12px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Project Completed!</h1>
              <p style="margin: 8px 0 0 0; color: #d1fae5; font-size: 14px;">Your project has been successfully delivered</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">
                Dear ${clientName},
              </h2>
              
              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                🎊 Congratulations! We are delighted to inform you that your project <strong>"${projectName}"</strong> has been <strong style="color: #059669;">successfully completed</strong>! Thank you for choosing Socilet for your project.
              </p>

              <!-- Project Summary Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; overflow: hidden;">
                <tr>
                  <td style="background-color: #059669; padding: 12px 24px;">
                    <h3 style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">📋 Project Summary</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Project Name</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${projectName}</td>
                      </tr>
                      <tr><td colspan="2" style="border-bottom: 1px solid #d1fae5;"></td></tr>
                      ${formattedStart ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📅 Start Date</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${formattedStart}</td>
                      </tr>
                      <tr><td colspan="2" style="border-bottom: 1px solid #d1fae5;"></td></tr>
                      ` : ''}
                      ${formattedEnd ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">✅ Completion Date</td>
                        <td style="padding: 8px 0; color: #059669; font-size: 14px; font-weight: 600; text-align: right;">${formattedEnd}</td>
                      </tr>
                      <tr><td colspan="2" style="border-bottom: 1px solid #d1fae5;"></td></tr>
                      ` : ''}
                      ${formattedDeadline ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🎯 Original Deadline</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${formattedDeadline}</td>
                      </tr>
                      <tr><td colspan="2" style="border-bottom: 1px solid #d1fae5;"></td></tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Summary Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; margin-top: 16px;">
                <tr>
                  <td style="background-color: #6366f1; padding: 12px 24px;">
                    <h3 style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">💰 Payment Summary</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Project Cost</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(totalAmount)}</td>
                      </tr>
                      <tr><td colspan="2" style="border-bottom: 1px solid #e5e7eb;"></td></tr>
                      <tr>
                        <td style="padding: 8px 0; color: #059669; font-size: 14px; font-weight: 500;">✅ Total Paid</td>
                        <td style="padding: 8px 0; color: #059669; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(paidAmount)}</td>
                      </tr>
                      ${remainingAmount > 0 ? `
                      <tr><td colspan="2" style="border-bottom: 1px solid #e5e7eb;"></td></tr>
                      <tr>
                        <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 500;">⏳ Remaining Balance</td>
                        <td style="padding: 8px 0; color: #dc2626; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(remainingAmount)}</td>
                      </tr>
                      ` : ''}
                    </table>

                    <!-- Progress Bar -->
                    <div style="margin-top: 16px;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #6b7280; font-size: 12px;">Payment Progress</span>
                        <span style="color: #059669; font-size: 12px; font-weight: 600;">${totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 100}%</span>
                      </div>
                      <div style="background-color: #e5e7eb; border-radius: 999px; height: 8px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); height: 100%; width: ${totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 100}%; border-radius: 999px;"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              ${remainingAmount > 0 ? `
              <div style="margin-top: 20px; padding: 16px; background-color: #fef3c7; border-radius: 8px; border: 1px solid #fcd34d;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  ⚠️ Please note: Your remaining balance of <strong>${formatCurrency(remainingAmount)}</strong> is pending. Kindly clear the dues at your earliest convenience.
                </p>
              </div>
              ` : `
              <div style="margin-top: 20px; padding: 16px; background-color: #d1fae5; border-radius: 8px; border: 1px solid #6ee7b7;">
                <p style="margin: 0; color: #065f46; font-size: 14px;">
                  ✅ All payments have been cleared. Thank you for the complete payment!
                </p>
              </div>
              `}

              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 24px 0 0 0;">
                We truly appreciate your trust in <strong>Socilet</strong>. It was a pleasure working with you on this project. We hope to collaborate with you again in the future! 🚀
              </p>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  If you need any support or have questions, we're always here to help.<br><br>
                  Warm regards,<br>
                  <strong style="color: #111827;">Team Socilet</strong>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <div style="margin-bottom: 16px;">
                <a href="https://socilet.in" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
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
  console.log('Project completion email function called');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) throw new Error('Admin access required');

    const body: CompletionEmailRequest = await req.json();
    const { clientEmail, clientName, projectName, totalAmount, paidAmount, remainingAmount } = body;

    if (!clientEmail || !clientName || !projectName) {
      throw new Error('Missing required fields');
    }

    console.log('Sending project completion email to:', clientEmail);

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [clientEmail],
      subject: `🎉 Project Completed - ${projectName} | Socilet`,
      html: getCompletionEmailHtml(body),
    });

    console.log('Completion email sent:', emailResponse);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseAdmin.from('email_logs').insert({
      email_type: 'project_completion',
      recipient_email: clientEmail,
      recipient_name: clientName,
      subject: `Project Completed - ${projectName}`,
      body_preview: `Project "${projectName}" completed. Total: ${formatCurrency(totalAmount)}, Paid: ${formatCurrency(paidAmount)}, Remaining: ${formatCurrency(remainingAmount)}`,
      status: 'sent',
      sent_by: user.id,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Project completion email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in project-completion-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.message === 'Unauthorized' || error.message === 'Admin access required' ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
