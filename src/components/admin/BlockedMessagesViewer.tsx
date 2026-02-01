import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, ShieldAlert, RefreshCw, Search, MessageSquareX, Users } from 'lucide-react';
import { format } from 'date-fns';

interface BlockedLog {
  id: string;
  sender_name: string;
  message_content: string;
  block_reason: string;
  matched_pattern: string | null;
  room_type: string;
  room_id: string | null;
  workspace_id: string | null;
  created_at: string;
}

export const BlockedMessagesViewer = () => {
  const [logs, setLogs] = useState<BlockedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blocked_chat_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Failed to fetch blocked logs:', error);
      toast.error('Failed to fetch blocked messages');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blocked_chat_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLogs(logs.filter(l => l.id !== id));
      toast.success('Log deleted');
    } catch (error: any) {
      console.error('Failed to delete log:', error);
      toast.error('Failed to delete log');
    }
  };

  const clearAllLogs = async () => {
    if (!confirm('Are you sure you want to delete all blocked message logs?')) return;
    
    try {
      const { error } = await supabase
        .from('blocked_chat_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
      setLogs([]);
      toast.success('All logs cleared');
    } catch (error: any) {
      console.error('Failed to clear logs:', error);
      toast.error('Failed to clear logs');
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.matched_pattern && log.matched_pattern.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || log.room_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getPatternBadgeColor = (pattern: string | null) => {
    if (!pattern) return 'secondary';
    if (pattern === 'email') return 'destructive';
    if (pattern === 'phone_number') return 'destructive';
    return 'outline';
  };

  const stats = {
    total: logs.length,
    meeting: logs.filter(l => l.room_type === 'meeting').length,
    workspace: logs.filter(l => l.room_type === 'workspace').length,
    uniqueUsers: new Set(logs.map(l => l.sender_name)).size,
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquareX className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
                <p className="text-xs text-muted-foreground">Unique Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{stats.meeting}</p>
              <p className="text-xs text-muted-foreground">Meeting Chat</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{stats.workspace}</p>
              <p className="text-xs text-muted-foreground">Workspace Chat</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Blocked Messages Log
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {logs.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearAllLogs}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, message, or pattern..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquareX className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No blocked messages found</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-sm">{log.sender_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.room_type}
                          </Badge>
                          {log.matched_pattern && (
                            <Badge variant={getPatternBadgeColor(log.matched_pattern)} className="text-xs">
                              {log.matched_pattern}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground bg-destructive/10 p-2 rounded border border-destructive/20 break-words">
                          {log.message_content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.block_reason}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(log.created_at), 'dd MMM yyyy, hh:mm a')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteLog(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
