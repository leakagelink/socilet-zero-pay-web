import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = "tagdedheeraj4@gmail.com";
const FROM_EMAIL = "Socilet <noreply@socilet.in>";

interface UpcomingPayment {
  id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  project_name?: string;
  work_description?: string;
  amount: number;
  due_date: string;
  days_until_due: number;
  source: 'project' | 'recurring' | 'other_income';
}

const getEmailHtml = (payments: UpcomingPayment[]) => {
  const paymentRows = payments.map(p => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">${p.client_name}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">${p.project_name || p.work_description || 'N/A'}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">₹${p.amount.toLocaleString('en-IN')}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">${p.due_date}</td>
      <td style="padding: 16px 12px; font-size: 14px; font-weight: 600; color: ${p.days_until_due <= 1 ? '#dc2626' : p.days_until_due <= 3 ? '#f59e0b' : '#10b981'};">${p.days_until_due} day${p.days_until_due !== 1 ? 's' : ''}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #6b7280;">${p.client_phone || 'N/A'}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Reminder - Socilet</title>
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
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Payment Reminder Alert</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 12px; padding: 16px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                  ⚠️ You have <strong>${payments.length} payment${payments.length !== 1 ? 's' : ''}</strong> due within the next 3 days!
                </p>
              </div>
              
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; font-weight: 600;">Upcoming Payments</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Client</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Project</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Amount</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Due Date</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Days Left</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  ${paymentRows}
                </tbody>
              </table>
              
              <div style="margin-top: 24px; padding: 16px; background-color: #f0fdf4; border-radius: 12px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                  💡 <strong>Tip:</strong> Contact these clients today to ensure timely payment collection.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This is an automated reminder from <strong>Socilet</strong>
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
  console.log('Payment reminder function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

    console.log('Checking payments due between', todayStr, 'and', threeDaysStr);

    const upcomingPayments: UpcomingPayment[] = [];

    // Check projects with remaining amount and deadline
    const { data: projects, error: projectsError } = await supabaseClient
      .from('projects')
      .select('id, client_name, client_email, client_phone, project_name, remaining_amount, deadline')
      .gt('remaining_amount', 0)
      .gte('deadline', todayStr)
      .lte('deadline', threeDaysStr);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    } else if (projects) {
      console.log('Found', projects.length, 'projects with upcoming deadlines');
      projects.forEach(p => {
        const dueDate = new Date(p.deadline);
        const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        upcomingPayments.push({
          id: p.id,
          client_name: p.client_name,
          client_email: p.client_email,
          client_phone: p.client_phone,
          project_name: p.project_name,
          amount: p.remaining_amount || 0,
          due_date: p.deadline,
          days_until_due: daysUntil,
          source: 'project'
        });
      });
    }

    // Check recurring earnings with next_billing_date
    const { data: recurring, error: recurringError } = await supabaseClient
      .from('recurring_earnings')
      .select('id, client_name, client_email, client_phone, project_name, amount, next_billing_date')
      .eq('is_active', true)
      .gte('next_billing_date', todayStr)
      .lte('next_billing_date', threeDaysStr);

    if (recurringError) {
      console.error('Error fetching recurring:', recurringError);
    } else if (recurring) {
      console.log('Found', recurring.length, 'recurring payments upcoming');
      recurring.forEach(r => {
        const dueDate = new Date(r.next_billing_date);
        const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        upcomingPayments.push({
          id: r.id,
          client_name: r.client_name,
          client_email: r.client_email,
          client_phone: r.client_phone,
          project_name: r.project_name,
          amount: r.amount || 0,
          due_date: r.next_billing_date,
          days_until_due: daysUntil,
          source: 'recurring'
        });
      });
    }

    // Check other income with due_date and pending status
    const { data: otherIncome, error: otherError } = await supabaseClient
      .from('other_income')
      .select('id, client_name, work_description, amount, due_date')
      .eq('status', 'pending')
      .not('due_date', 'is', null)
      .gte('due_date', todayStr)
      .lte('due_date', threeDaysStr);

    if (otherError) {
      console.error('Error fetching other income:', otherError);
    } else if (otherIncome) {
      console.log('Found', otherIncome.length, 'other income payments upcoming');
      otherIncome.forEach(o => {
        const dueDate = new Date(o.due_date);
        const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        upcomingPayments.push({
          id: o.id,
          client_name: o.client_name,
          work_description: o.work_description,
          amount: o.amount || 0,
          due_date: o.due_date,
          days_until_due: daysUntil,
          source: 'other_income'
        });
      });
    }

    if (upcomingPayments.length === 0) {
      console.log('No upcoming payments found');
      return new Response(
        JSON.stringify({ message: 'No upcoming payments', count: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sort by days until due
    upcomingPayments.sort((a, b) => a.days_until_due - b.days_until_due);

    console.log('Sending reminder email for', upcomingPayments.length, 'payments');

    // Send email
    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `💰 Payment Reminder: ${upcomingPayments.length} payment${upcomingPayments.length !== 1 ? 's' : ''} due soon - Socilet`,
      html: getEmailHtml(upcomingPayments),
    });

    console.log('Email sent:', emailResponse);

    // Log each payment reminder
    for (const payment of upcomingPayments) {
      await supabaseClient.from('email_logs').insert({
        email_type: 'payment_reminder',
        recipient_email: ADMIN_EMAIL,
        recipient_name: 'Admin',
        subject: `Payment Reminder: ${payment.client_name} - ₹${payment.amount.toLocaleString('en-IN')}`,
        body_preview: `${payment.project_name || payment.work_description} - Due in ${payment.days_until_due} day(s)`,
        status: 'sent',
        related_project_id: payment.source === 'project' ? payment.id : null,
        related_recurring_id: payment.source === 'recurring' ? payment.id : null,
        related_other_income_id: payment.source === 'other_income' ? payment.id : null,
        days_until_due: payment.days_until_due,
      });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Reminder sent successfully', 
        count: upcomingPayments.length,
        payments: upcomingPayments 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in payment-reminder function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
