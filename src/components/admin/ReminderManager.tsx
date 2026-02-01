import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, Bell, Calendar, Clock, AlertTriangle, CheckCircle2, 
  Trash2, Edit, Filter, Search, X, RefreshCw 
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

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
  is_recurring: boolean;
  recurring_frequency: string | null;
  notes: string | null;
  created_at: string;
}

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-destructive/10 text-destructive',
  urgent: 'bg-destructive/20 text-destructive',
};

const statusColors: Record<string, string> = {
  pending: 'bg-primary/10 text-primary',
  completed: 'bg-primary/10 text-primary',
  snoozed: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-muted text-muted-foreground',
};

const ReminderManager = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminder_date: format(new Date(), 'yyyy-MM-dd'),
    reminder_time: '',
    priority: 'medium',
    category: '',
    related_client_name: '',
    is_recurring: false,
    recurring_frequency: '',
    notes: '',
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reminder_date: format(new Date(), 'yyyy-MM-dd'),
      reminder_time: '',
      priority: 'medium',
      category: '',
      related_client_name: '',
      is_recurring: false,
      recurring_frequency: '',
      notes: '',
    });
    setEditingReminder(null);
  };

  const handleOpenDialog = (reminder?: Reminder) => {
    if (reminder) {
      setEditingReminder(reminder);
      setFormData({
        title: reminder.title,
        description: reminder.description || '',
        reminder_date: reminder.reminder_date,
        reminder_time: reminder.reminder_time || '',
        priority: reminder.priority,
        category: reminder.category || '',
        related_client_name: reminder.related_client_name || '',
        is_recurring: reminder.is_recurring,
        recurring_frequency: reminder.recurring_frequency || '',
        notes: reminder.notes || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.reminder_date) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        reminder_date: formData.reminder_date,
        reminder_time: formData.reminder_time || null,
        priority: formData.priority,
        category: formData.category.trim() || null,
        related_client_name: formData.related_client_name.trim() || null,
        is_recurring: formData.is_recurring,
        recurring_frequency: formData.is_recurring ? formData.recurring_frequency : null,
        notes: formData.notes.trim() || null,
      };

      if (editingReminder) {
        const { error } = await supabase
          .from('reminders')
          .update(payload)
          .eq('id', editingReminder.id);
        if (error) throw error;
        toast.success('Reminder updated!');
      } else {
        const { error } = await supabase
          .from('reminders')
          .insert(payload);
        if (error) throw error;
        toast.success('Reminder created!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchReminders();
    } catch (error: any) {
      console.error('Error saving reminder:', error);
      toast.error('Failed to save reminder');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Reminder marked as ${newStatus}`);
      fetchReminders();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Reminder deleted');
      fetchReminders();
    } catch (error: any) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  const handleSnooze = async (id: string, days: number) => {
    try {
      const newDate = format(addDays(new Date(), days), 'yyyy-MM-dd');
      const { error } = await supabase
        .from('reminders')
        .update({ reminder_date: newDate, status: 'pending' })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Reminder snoozed for ${days} day(s)`);
      fetchReminders();
    } catch (error: any) {
      console.error('Error snoozing reminder:', error);
      toast.error('Failed to snooze reminder');
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'dd MMM yyyy');
  };

  const filteredReminders = reminders.filter((reminder) => {
    if (filterStatus !== 'all' && reminder.status !== filterStatus) return false;
    if (filterPriority !== 'all' && reminder.priority !== filterPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        reminder.title.toLowerCase().includes(query) ||
        reminder.description?.toLowerCase().includes(query) ||
        reminder.related_client_name?.toLowerCase().includes(query) ||
        reminder.category?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: reminders.length,
    pending: reminders.filter((r) => r.status === 'pending').length,
    overdue: reminders.filter((r) => r.status === 'pending' && isPast(new Date(r.reminder_date))).length,
    today: reminders.filter((r) => r.status === 'pending' && isToday(new Date(r.reminder_date))).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Reminders
          </h2>
          <p className="text-sm text-muted-foreground">Manage your reminders and follow-ups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingReminder ? 'Edit Reminder' : 'New Reminder'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title *</label>
                <Input
                  placeholder="Reminder title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea
                  placeholder="Add details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date *</label>
                  <Input
                    type="date"
                    value={formData.reminder_date}
                    onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time</label>
                  <Input
                    type="time"
                    value={formData.reminder_time}
                    onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <Input
                    placeholder="e.g., Payment, Follow-up"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Client Name</label>
                <Input
                  placeholder="Related client (optional)"
                  value={formData.related_client_name}
                  onChange={(e) => setFormData({ ...formData, related_client_name: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_recurring" className="text-sm">Recurring reminder</label>
                {formData.is_recurring && (
                  <Select
                    value={formData.recurring_frequency}
                    onValueChange={(v) => setFormData({ ...formData, recurring_frequency: v })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Notes</label>
                <Textarea
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingReminder ? 'Update' : 'Create'} Reminder
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Reminders</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/5">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.today}</div>
            <div className="text-xs text-muted-foreground">Due Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="snoozed">Snoozed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchReminders}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Reminders List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading reminders...</div>
      ) : filteredReminders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-foreground mb-1">No reminders found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first reminder to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((reminder) => {
            const isOverdue = reminder.status === 'pending' && isPast(new Date(reminder.reminder_date));
            const dateLabel = getDateLabel(reminder.reminder_date);

            return (
              <Card
                key={reminder.id}
                className={`transition-all hover:shadow-md ${
                  isOverdue ? 'border-red-300 dark:border-red-800' : ''
                } ${reminder.status === 'completed' ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`font-medium ${reminder.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {reminder.title}
                        </h3>
                        <Badge className={priorityColors[reminder.priority]} variant="secondary">
                          {reminder.priority}
                        </Badge>
                        <Badge className={statusColors[reminder.status]} variant="secondary">
                          {reminder.status}
                        </Badge>
                        {reminder.is_recurring && (
                          <Badge variant="outline" className="gap-1">
                            <RefreshCw className="h-3 w-3" />
                            {reminder.recurring_frequency}
                          </Badge>
                        )}
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                          <Calendar className="h-3 w-3" />
                          {dateLabel}
                        </span>
                        {reminder.reminder_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reminder.reminder_time}
                          </span>
                        )}
                        {reminder.related_client_name && (
                          <span>👤 {reminder.related_client_name}</span>
                        )}
                        {reminder.category && (
                          <Badge variant="outline" className="text-xs">{reminder.category}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {reminder.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(reminder.id, 'completed')}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(v) => handleSnooze(reminder.id, parseInt(v))}>
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <span>Snooze</span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">1 week</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}
                      {reminder.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(reminder.id, 'pending')}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          Reopen
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(reminder)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reminder.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReminderManager;
