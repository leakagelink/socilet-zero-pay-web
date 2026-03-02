import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM_EMAIL = "Socilet <hello@socilet.in>";

interface ProjectDetail {
  project_name: string;
  project_status: string;
  total_amount: number;
  advance_amount: number;
  remaining_amount: number;
  deadline: string | null;
}

interface InvoiceEmailRequest {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  projects: ProjectDetail[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  dueDate: string | null;
  notes: string | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return '#10b981';
    case 'in_progress': case 'running': return '#3b82f6';
    case 'pending': return '#f59e0b';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return '✅ Completed';
    case 'in_progress': case 'running': return '🔄 Running';
    case 'pending': return '⏳ Pending';
    case 'cancelled': return '❌ Cancelled';
    default: return status;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getInvoiceHtml = (data: InvoiceEmailRequest) => {
  const projectRows = data.projects.map(p => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${p.project_name}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #fff; background-color: ${getStatusColor(p.project_status)};">
          ${getStatusLabel(p.project_status)}
        </span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #374151;">${formatCurrency(p.total_amount)}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #10b981;">${formatCurrency(p.advance_amount)}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #ef4444; font-weight: 600;">${formatCurrency(p.remaining_amount)}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13px; color: #6b7280;">${formatDate(p.deadline)}</td>
    </tr>
  `).join('');

  const paidPercentage = data.totalAmount > 0 ? Math.round((data.totalPaid / data.totalAmount) * 100) : 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="700" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
              <img src="https://knputxpnhffskshlakiq.supabase.co/storage/v1/object/public/email-assets/socilet-logo.png?v=2" alt="Socilet" style="height: 60px; margin-bottom: 8px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">INVOICE</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 500;">${data.invoiceNumber}</p>
            </td>
          </tr>

          <!-- Client Info -->
          <tr>
            <td style="padding: 24px 32px 16px;">
              <table width="100%">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Bill To</p>
                    <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #111827;">${data.clientName}</h2>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${data.clientEmail}</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">Invoice Date</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #111827;">${formatDate(new Date().toISOString())}</p>
                    ${data.dueDate ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: #6b7280;">Due Date</p><p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #ef4444;">${formatDate(data.dueDate)}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Projects Table -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 12px; font-size: 16px; color: #111827; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">📋 Project Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Project</th>
                    <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Status</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Total</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Paid</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Due</th>
                    <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  ${projectRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Payment Summary -->
          <tr>
            <td style="padding: 16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%"></td>
                  <td width="50%">
                    <table width="100%" style="background: #f9fafb; border-radius: 12px; overflow: hidden;">
                      <tr>
                        <td style="padding: 12px 20px; font-size: 14px; color: #374151;">Subtotal</td>
                        <td style="padding: 12px 20px; text-align: right; font-size: 14px; font-weight: 600;">${formatCurrency(data.subtotal)}</td>
                      </tr>
                      ${data.taxAmount > 0 ? `<tr><td style="padding: 8px 20px; font-size: 14px; color: #374151;">Tax (${data.taxRate}%)</td><td style="padding: 8px 20px; text-align: right; font-size: 14px;">${formatCurrency(data.taxAmount)}</td></tr>` : ''}
                      ${data.discountAmount > 0 ? `<tr><td style="padding: 8px 20px; font-size: 14px; color: #ef4444;">Discount</td><td style="padding: 8px 20px; text-align: right; font-size: 14px; color: #ef4444;">-${formatCurrency(data.discountAmount)}</td></tr>` : ''}
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="padding: 16px 20px; font-size: 18px; font-weight: 700; color: #111827;">Grand Total</td>
                        <td style="padding: 16px 20px; text-align: right; font-size: 18px; font-weight: 700; color: #6366f1;">${formatCurrency(data.totalAmount)}</td>
                      </tr>
                      <tr style="background-color: #ecfdf5;">
                        <td style="padding: 10px 20px; font-size: 14px; color: #10b981; font-weight: 600;">Amount Paid</td>
                        <td style="padding: 10px 20px; text-align: right; font-size: 14px; color: #10b981; font-weight: 600;">${formatCurrency(data.totalPaid)}</td>
                      </tr>
                      <tr style="background-color: #fef2f2;">
                        <td style="padding: 10px 20px; font-size: 14px; color: #ef4444; font-weight: 700;">Amount Due</td>
                        <td style="padding: 10px 20px; text-align: right; font-size: 16px; color: #ef4444; font-weight: 700;">${formatCurrency(data.totalRemaining)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Progress -->
          <tr>
            <td style="padding: 0 32px 16px;">
              <p style="margin: 0 0 6px; font-size: 13px; color: #6b7280;">Payment Progress: ${paidPercentage}%</p>
              <div style="background-color: #e5e7eb; border-radius: 10px; height: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); height: 100%; width: ${paidPercentage}%; border-radius: 10px;"></div>
              </div>
            </td>
          </tr>

          ${data.notes ? `
          <tr>
            <td style="padding: 0 32px 16px;">
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px;">
                <p style="margin: 0; font-size: 13px; font-weight: 600; color: #92400e;">📝 Notes</p>
                <p style="margin: 4px 0 0; font-size: 14px; color: #78350f;">${data.notes}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">Thank you for choosing Socilet! 🙏</p>
              <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">
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

    const body: InvoiceEmailRequest = await req.json();

    if (!body.clientEmail || !body.invoiceNumber) {
      throw new Error('Missing required fields');
    }

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [body.clientEmail],
      subject: `Invoice ${body.invoiceNumber} - Socilet`,
      html: getInvoiceHtml(body),
    });

    console.log('Invoice email sent:', emailResponse);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseAdmin.from('email_logs').insert({
      email_type: 'invoice',
      recipient_email: body.clientEmail,
      recipient_name: body.clientName,
      subject: `Invoice ${body.invoiceNumber} - Socilet`,
      body_preview: `Multi-project invoice for ${body.projects.length} projects. Total: ${formatCurrency(body.totalAmount)}, Due: ${formatCurrency(body.totalRemaining)}`,
      status: 'sent',
      sent_by: user.id,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.message?.includes('Unauthorized') || error.message?.includes('Admin') ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
