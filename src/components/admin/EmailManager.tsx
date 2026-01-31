import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Mail, 
  Send, 
  Inbox, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Loader2,
  Eye,
  Reply,
  Trash2,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EmailLog {
  id: string;
  email_type: string;
  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  body_preview: string | null;
  status: string;
  days_until_due: number | null;
  created_at: string;
}

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}

const EmailManager = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCheckingReminders, setIsCheckingReminders] = useState(false);
  
  // Compose email form
  const [composeTo, setComposeTo] = useState('');
  const [composeToName, setComposeToName] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  
  // Reply dialog
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // View message dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch email logs
      const { data: logs, error: logsError } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;
      setEmailLogs(logs || []);

      // Fetch contact messages
      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;
      setContactMessages(messages || []);
    } catch (error: any) {
      console.error('Error fetching email data:', error);
      toast.error('Failed to load email data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeMessage) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-manual-email', {
        body: {
          to: composeTo,
          toName: composeToName || undefined,
          subject: composeSubject,
          message: composeMessage,
        },
      });

      if (error) throw error;

      toast.success('Email sent successfully!');
      setComposeTo('');
      setComposeToName('');
      setComposeSubject('');
      setComposeMessage('');
      fetchData();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckReminders = async () => {
    setIsCheckingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-reminder');

      if (error) throw error;

      if (data.count === 0) {
        toast.info('No upcoming payments in the next 3 days');
      } else {
        toast.success(`Reminder sent for ${data.count} payment(s)`);
      }
      fetchData();
    } catch (error: any) {
      console.error('Error checking reminders:', error);
      toast.error(error.message || 'Failed to check reminders');
    } finally {
      setIsCheckingReminders(false);
    }
  };

  const handleReply = async () => {
    if (!replyingTo || !replyMessage) return;

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-manual-email', {
        body: {
          to: replyingTo.sender_email,
          toName: replyingTo.sender_name,
          subject: `Re: ${replyingTo.subject || 'Your inquiry'}`,
          message: replyMessage,
        },
      });

      if (error) throw error;

      // Mark as replied
      await supabase
        .from('contact_messages')
        .update({ is_replied: true, replied_at: new Date().toISOString() })
        .eq('id', replyingTo.id);

      toast.success('Reply sent successfully!');
      setReplyDialogOpen(false);
      setReplyingTo(null);
      setReplyMessage('');
      fetchData();
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      toast.success('Message deleted');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const openReplyDialog = (message: ContactMessage) => {
    setReplyingTo(message);
    setReplyMessage('');
    setReplyDialogOpen(true);
  };

  const openViewDialog = (message: ContactMessage) => {
    setViewingMessage(message);
    setViewDialogOpen(true);
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = contactMessages.filter(m => !m.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Email Manager</h2>
            <p className="text-sm text-muted-foreground">Send emails & manage messages</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckReminders}
            disabled={isCheckingReminders}
          >
            {isCheckingReminders ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            Check Reminders
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="compose" className="rounded-lg">
            <Send className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="inbox" className="rounded-lg">
            <Inbox className="h-4 w-4 mr-2" />
            Inbox
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="rounded-lg">
            <Clock className="h-4 w-4 mr-2" />
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">To (Email) *</label>
                    <Input
                      type="email"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      placeholder="recipient@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipient Name</label>
                    <Input
                      type="text"
                      value={composeToName}
                      onChange={(e) => setComposeToName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject *</label>
                  <Input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Email subject"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <Textarea
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={8}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSending} className="w-full md:w-auto">
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Received Messages ({contactMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No messages received yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                        !msg.is_read ? 'bg-primary/5 border-primary/20' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{msg.sender_name}</span>
                            {!msg.is_read && (
                              <Badge variant="secondary" className="text-xs">New</Badge>
                            )}
                            {msg.is_replied && (
                              <Badge variant="outline" className="text-xs text-green-600">Replied</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.sender_email}</p>
                          {msg.sender_phone && (
                            <p className="text-sm text-muted-foreground">📞 {msg.sender_phone}</p>
                          )}
                          <p className="text-sm font-medium mt-2">{msg.subject || 'No subject'}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{msg.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(msg.created_at)}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewDialog(msg)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openReplyDialog(msg)}
                            title="Reply"
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Sent Emails ({emailLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emailLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No emails sent yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emailLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={log.email_type === 'payment_reminder' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {log.email_type === 'payment_reminder' ? '💰 Reminder' : '✉️ Manual'}
                            </Badge>
                            {log.status === 'sent' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <p className="font-medium text-foreground">{log.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            To: {log.recipient_name ? `${log.recipient_name} <${log.recipient_email}>` : log.recipient_email}
                          </p>
                          {log.body_preview && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{log.body_preview}</p>
                          )}
                          {log.days_until_due !== null && (
                            <p className="text-xs text-amber-600 mt-1">Due in {log.days_until_due} day(s)</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(log.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {viewingMessage?.sender_name}</DialogTitle>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> {viewingMessage.sender_email}</p>
                {viewingMessage.sender_phone && (
                  <p className="text-sm"><strong>Phone:</strong> {viewingMessage.sender_phone}</p>
                )}
                <p className="text-sm"><strong>Subject:</strong> {viewingMessage.subject || 'No subject'}</p>
                <p className="text-sm text-muted-foreground">{formatDate(viewingMessage.created_at)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap">{viewingMessage.message}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openReplyDialog(viewingMessage)} className="flex-1">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {replyingTo?.sender_name}</DialogTitle>
          </DialogHeader>
          {replyingTo && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">Original message:</p>
                <p className="text-muted-foreground line-clamp-3 mt-1">{replyingTo.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Reply</label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write your reply..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleReply} disabled={isSending || !replyMessage} className="flex-1">
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailManager;
