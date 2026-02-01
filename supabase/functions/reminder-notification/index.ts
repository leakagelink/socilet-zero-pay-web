import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAILS = ["tagdedheeraj4@gmail.com", "hello@socilet.in"];
const FROM_EMAIL = "Socilet <hello@socilet.in>";
const LOGO_URL = "https://knputxpnhffskshlakiq.supabase.co/storage/v1/object/public/email-assets/socilet-logo.png?v=2";

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  reminder_date: string;
  reminder_time: string | null;
  priority: string;
  status: string;
  category: string | null;
  related_client_name: string | null;
  notes: string | null;
}

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return '#dc2626';
    case 'high': return '#f59e0b';
    case 'medium': return '#3b82f6';
    default: return '#10b981';
  }
};

// Get priority label
const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'urgent': return '🚨 URGENT';
    case 'high': return '⚠️ High';
    case 'medium': return '📌 Medium';
    default: return '📋 Low';
  }
};

// Daily reminder email template
const getDailyReminderEmailHtml = (reminders: Reminder[], daysLeft: number) => {
  const reminderRows = reminders.map(r => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">
        <span style="color: ${getPriorityColor(r.priority)}; font-weight: 600;">${getPriorityLabel(r.priority)}</span>
      </td>
      <td style="padding: 16px 12px; font-size: 14px; color: #374151; font-weight: 600;">${r.title}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #6b7280;">${r.description || '-'}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">${r.reminder_date}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #374151;">${r.reminder_time || 'All Day'}</td>
      <td style="padding: 16px 12px; font-size: 14px; color: #6b7280;">${r.related_client_name || '-'}</td>
    </tr>
  `).join('');

  const subjectText = daysLeft === 0 
    ? "⏰ Today's Reminders" 
    : daysLeft === 1 
      ? "📅 Tomorrow's Reminders" 
      : `📆 Reminders in ${daysLeft} Days`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder Alert - Socilet</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 32px; text-align: center;">
              <img src="${LOGO_URL}" alt="Socilet" style="height: 70px; margin-bottom: 12px;">
              <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 600;">${subjectText}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 12px; padding: 16px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                  ${daysLeft === 0 
                    ? `⏰ You have <strong>${reminders.length} reminder${reminders.length !== 1 ? 's' : ''}</strong> for TODAY!`
                    : `📅 You have <strong>${reminders.length} reminder${reminders.length !== 1 ? 's' : ''}</strong> coming up in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`
                  }
                </p>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Priority</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Title</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Description</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Date</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Time</th>
                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Client</th>
                  </tr>
                </thead>
                <tbody>
                  ${reminderRows}
                </tbody>
              </table>
              
              <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  💡 <strong>Tip:</strong> Open your admin panel to mark reminders as completed or snooze them.
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

// Last hour urgent reminder email template
const getUrgentReminderEmailHtml = (reminder: Reminder) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>URGENT: 1 Hour Left - Socilet</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px; text-align: center;">
              <img src="${LOGO_URL}" alt="Socilet" style="height: 70px; margin-bottom: 12px;">
              <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 700;">⚡ 1 HOUR LEFT!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #dc2626;">
                <p style="margin: 0; color: #991b1b; font-size: 16px; font-weight: 600;">
                  🚨 This is your FINAL reminder! Only 1 hour remaining.
                </p>
              </div>
              
              <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 2px solid #e5e7eb;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="color: #6b7280; font-size: 13px;">Title</span>
                      <p style="margin: 4px 0 0 0; color: #111827; font-size: 20px; font-weight: 700;">${reminder.title}</p>
                    </td>
                  </tr>
                  ${reminder.description ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="color: #6b7280; font-size: 13px;">Description</span>
                      <p style="margin: 4px 0 0 0; color: #374151; font-size: 15px;">${reminder.description}</p>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="color: #6b7280; font-size: 13px;">Scheduled Time</span>
                      <p style="margin: 4px 0 0 0; color: #dc2626; font-size: 18px; font-weight: 600;">${reminder.reminder_time || 'All Day'}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="color: #6b7280; font-size: 13px;">Priority</span>
                      <p style="margin: 4px 0 0 0; color: ${getPriorityColor(reminder.priority)}; font-size: 15px; font-weight: 600;">${getPriorityLabel(reminder.priority)}</p>
                    </td>
                  </tr>
                  ${reminder.related_client_name ? `
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="color: #6b7280; font-size: 13px;">Client</span>
                      <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px; font-weight: 600;">${reminder.related_client_name}</p>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${reminder.notes ? `
              <div style="margin-bottom: 24px; padding: 16px; background-color: #fefce8; border-radius: 12px; border-left: 4px solid #eab308;">
                <p style="margin: 0 0 4px 0; color: #854d0e; font-size: 12px; font-weight: 600;">NOTES:</p>
                <p style="margin: 0; color: #713f12; font-size: 14px;">${reminder.notes}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://socilet.in/admin-panel" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Open Admin Panel
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This is an automated urgent reminder from <strong>Socilet</strong>
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
  console.log('Reminder notification function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body for type of check
    let checkType = 'daily'; // 'daily' for 3-day advance check, 'hourly' for 1-hour check
    try {
      const body = await req.json();
      checkType = body.checkType || 'daily';
    } catch {
      // Default to daily if no body
    }

    console.log('Check type:', checkType);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    let emailsSent = 0;
    const results: any[] = [];

    if (checkType === 'daily') {
      // Check reminders for next 3 days (3, 2, 1, 0 days ahead)
      for (let daysAhead = 3; daysAhead >= 0; daysAhead--) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysAhead);
        const targetDateStr = targetDate.toISOString().split('T')[0];

        console.log(`Checking reminders for ${targetDateStr} (${daysAhead} days ahead)`);

        const { data: reminders, error } = await supabaseClient
          .from('reminders')
          .select('*')
          .eq('reminder_date', targetDateStr)
          .eq('status', 'pending')
          .order('reminder_time', { ascending: true });

        if (error) {
          console.error('Error fetching reminders:', error);
          continue;
        }

        if (reminders && reminders.length > 0) {
          console.log(`Found ${reminders.length} reminders for ${targetDateStr}`);

          // Send email to both admin addresses
          for (const adminEmail of ADMIN_EMAILS) {
            try {
              const subjectText = daysAhead === 0 
                ? `⏰ ${reminders.length} Reminder${reminders.length !== 1 ? 's' : ''} for TODAY!` 
                : daysAhead === 1 
                  ? `📅 ${reminders.length} Reminder${reminders.length !== 1 ? 's' : ''} for Tomorrow` 
                  : `📆 ${reminders.length} Reminder${reminders.length !== 1 ? 's' : ''} in ${daysAhead} Days`;

              const emailResponse = await resend.emails.send({
                from: FROM_EMAIL,
                to: [adminEmail],
                subject: `${subjectText} - Socilet`,
                html: getDailyReminderEmailHtml(reminders, daysAhead),
              });

              console.log(`Daily reminder email sent to ${adminEmail}:`, emailResponse);
              emailsSent++;

              // Log email to email_logs table
              await supabaseClient.from('email_logs').insert({
                email_type: 'reminder_notification',
                recipient_email: adminEmail,
                recipient_name: 'Admin',
                subject: `${subjectText} - Socilet`,
                body_preview: `${reminders.length} reminder(s) for ${targetDateStr}`,
                status: 'sent',
                days_until_due: daysAhead,
              });

              results.push({
                type: 'daily',
                daysAhead,
                reminderCount: reminders.length,
                sentTo: adminEmail,
                status: 'sent'
              });
            } catch (emailError) {
              console.error(`Error sending email to ${adminEmail}:`, emailError);
              
              // Log failed email
              await supabaseClient.from('email_logs').insert({
                email_type: 'reminder_notification',
                recipient_email: adminEmail,
                recipient_name: 'Admin',
                subject: `Reminder Notification`,
                status: 'failed',
                error_message: emailError.message,
                days_until_due: daysAhead,
              });

              results.push({
                type: 'daily',
                daysAhead,
                reminderCount: reminders.length,
                sentTo: adminEmail,
                status: 'failed',
                error: emailError.message
              });
            }
          }
        }
      }
    } else if (checkType === 'hourly') {
      // Check for reminders happening in exactly 1 hour
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const currentHour = oneHourLater.getHours().toString().padStart(2, '0');
      const currentMinute = oneHourLater.getMinutes().toString().padStart(2, '0');
      const targetTime = `${currentHour}:${currentMinute}`;
      
      // We'll check for reminders within a 5-minute window
      const startMinute = Math.max(0, parseInt(currentMinute) - 2);
      const endMinute = Math.min(59, parseInt(currentMinute) + 2);

      console.log(`Checking reminders for today at approximately ${targetTime}`);

      const { data: reminders, error } = await supabaseClient
        .from('reminders')
        .select('*')
        .eq('reminder_date', todayStr)
        .eq('status', 'pending')
        .not('reminder_time', 'is', null);

      if (error) {
        console.error('Error fetching reminders:', error);
      } else if (reminders) {
        // Filter reminders that are approximately 1 hour away
        const upcomingReminders = reminders.filter(r => {
          if (!r.reminder_time) return false;
          const [rHour, rMinute] = r.reminder_time.split(':').map(Number);
          const reminderMinutes = rHour * 60 + rMinute;
          const targetMinutes = parseInt(currentHour) * 60 + parseInt(currentMinute);
          const diff = Math.abs(reminderMinutes - targetMinutes);
          return diff <= 5; // Within 5 minutes
        });

        console.log(`Found ${upcomingReminders.length} reminders happening in ~1 hour`);

        for (const reminder of upcomingReminders) {
          for (const adminEmail of ADMIN_EMAILS) {
            try {
              const emailResponse = await resend.emails.send({
                from: FROM_EMAIL,
                to: [adminEmail],
                subject: `⚡ 1 HOUR LEFT: ${reminder.title} - Socilet`,
                html: getUrgentReminderEmailHtml(reminder),
              });

              console.log(`Urgent reminder email sent to ${adminEmail}:`, emailResponse);
              emailsSent++;

              // Log urgent email
              await supabaseClient.from('email_logs').insert({
                email_type: 'urgent_reminder',
                recipient_email: adminEmail,
                recipient_name: 'Admin',
                subject: `⚡ 1 HOUR LEFT: ${reminder.title} - Socilet`,
                body_preview: `Urgent reminder: ${reminder.title} at ${reminder.reminder_time}`,
                status: 'sent',
                days_until_due: 0,
              });

              results.push({
                type: 'urgent',
                reminderId: reminder.id,
                title: reminder.title,
                sentTo: adminEmail,
                status: 'sent'
              });
            } catch (emailError) {
              console.error(`Error sending urgent email to ${adminEmail}:`, emailError);
              
              // Log failed urgent email
              await supabaseClient.from('email_logs').insert({
                email_type: 'urgent_reminder',
                recipient_email: adminEmail,
                recipient_name: 'Admin',
                subject: `⚡ 1 HOUR LEFT: ${reminder.title}`,
                status: 'failed',
                error_message: emailError.message,
                days_until_due: 0,
              });

              results.push({
                type: 'urgent',
                reminderId: reminder.id,
                title: reminder.title,
                sentTo: adminEmail,
                status: 'failed',
                error: emailError.message
              });
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checkType,
        emailsSent,
        results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in reminder notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
