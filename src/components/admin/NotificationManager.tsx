import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Send, Mail, MessageSquare, Clock, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type NotificationType = 'payment_reminder' | 'task_due' | 'project_update' | 'invoice_sent' | 'general';

interface NotificationLog {
  id: string;
  notification_type: NotificationType;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_phone: string | null;
  channel: string;
  subject: string | null;
  message: string;
  related_project_id: string | null;
  related_invoice_id: string | null;
  related_task_id: string | null;
  status: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
}

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
}

const notificationTypeLabels: Record<NotificationType, { label: string; color: string }> = {
  payment_reminder: { label: 'Payment Reminder', color: 'bg-amber-100 text-amber-700' },
  task_due: { label: 'Task Due', color: 'bg-blue-100 text-blue-700' },
  project_update: { label: 'Project Update', color: 'bg-purple-100 text-purple-700' },
  invoice_sent: { label: 'Invoice Sent', color: 'bg-emerald-100 text-emerald-700' },
  general: { label: 'General', color: 'bg-slate-100 text-slate-700' },
};

const NotificationManager = () => {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);

  const [formData, setFormData] = useState({
    notification_type: 'general' as NotificationType,
    recipient_name: '',
    recipient_email: '',
    recipient_phone: '',
    channel: 'email',
    subject: '',
    message: '',
    project_id: '',
  });

  useEffect(() => {
    fetchNotifications();
    fetchProjects();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      const typedData = (data || []).map(n => ({
        ...n,
        notification_type: n.notification_type as NotificationType,
      }));
      
      setNotifications(typedData);
    } catch (error: any) {
      toast.error('Failed to fetch notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, client_name, client_email, client_phone')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setFormData({
        ...formData,
        project_id: projectId,
        recipient_name: project.client_name,
        recipient_email: project.client_email || '',
        recipient_phone: project.client_phone || '',
      });
    }
  };

  const handleSendNotification = async () => {
    if (!formData.recipient_email && !formData.recipient_phone) {
      toast.error('Email or phone is required');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    setIsSending(true);

    try {
      // For email notifications, use the send-manual-email edge function
      if (formData.channel === 'email' && formData.recipient_email) {
        const { error: emailError } = await supabase.functions.invoke('send-manual-email', {
          body: {
            to: formData.recipient_email,
            subject: formData.subject || 'Notification from Socilet',
            recipientName: formData.recipient_name || 'Customer',
            body: formData.message,
          },
        });

        if (emailError) throw emailError;
      }

      // Log the notification
      const { error } = await supabase.from('notifications_log').insert([{
        notification_type: formData.notification_type,
        recipient_name: formData.recipient_name || null,
        recipient_email: formData.recipient_email || null,
        recipient_phone: formData.recipient_phone || null,
        channel: formData.channel,
        subject: formData.subject || null,
        message: formData.message,
        related_project_id: formData.project_id || null,
        status: 'sent',
        sent_at: new Date().toISOString(),
      }]);

      if (error) throw error;

      toast.success('Notification sent successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (error: any) {
      // Log failed notification
      await supabase.from('notifications_log').insert([{
        notification_type: formData.notification_type,
        recipient_name: formData.recipient_name || null,
        recipient_email: formData.recipient_email || null,
        recipient_phone: formData.recipient_phone || null,
        channel: formData.channel,
        subject: formData.subject || null,
        message: formData.message,
        related_project_id: formData.project_id || null,
        status: 'failed',
        error_message: error.message,
      }]);

      toast.error(error.message || 'Failed to send notification');
      fetchNotifications();
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setFormData({
      notification_type: 'general',
      recipient_name: '',
      recipient_email: '',
      recipient_phone: '',
      channel: 'email',
      subject: '',
      message: '',
      project_id: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = 
      (n.recipient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (n.recipient_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    pending: notifications.filter(n => n.status === 'pending').length,
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6" />
            <CardTitle className="text-xl">Notification Center</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <Send className="h-4 w-4" /> Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Link to Project (Optional)</Label>
                  <Select value={formData.project_id} onValueChange={handleProjectSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Project</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.project_name} - {project.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select 
                      value={formData.notification_type} 
                      onValueChange={(v: NotificationType) => setFormData({ ...formData, notification_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(notificationTypeLabels).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Select value={formData.channel} onValueChange={(v) => setFormData({ ...formData, channel: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">📧 Email</SelectItem>
                        <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <Input
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    placeholder="Client name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.recipient_email}
                      onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                      placeholder="client@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.recipient_phone}
                      onChange={(e) => setFormData({ ...formData, recipient_phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Notification subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSendNotification} disabled={isSending}>
                  {isSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.sent}</p>
            <p className="text-sm text-muted-foreground">Sent</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-sm text-muted-foreground">Failed</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/30 rounded-xl border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getChannelIcon(notification.channel)}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge className={notificationTypeLabels[notification.notification_type].color}>
                        {notificationTypeLabels[notification.notification_type].label}
                      </Badge>
                      {getStatusBadge(notification.status)}
                    </div>
                    <p className="font-medium text-foreground truncate">
                      {notification.recipient_name || notification.recipient_email || 'Unknown'}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground shrink-0">
                  {notification.sent_at ? (
                    <p>{new Date(notification.sent_at).toLocaleString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</p>
                  ) : (
                    <p>{new Date(notification.created_at).toLocaleString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</p>
                  )}
                  {notification.error_message && (
                    <p className="text-xs text-destructive mt-1 truncate max-w-[200px]" title={notification.error_message}>
                      {notification.error_message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationManager;
