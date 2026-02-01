import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, X, FileIcon } from 'lucide-react';
import { toast } from 'sonner';

interface WorkspaceMessage {
  id: string;
  workspace_id: string;
  sender_name: string;
  content: string;
  message_type: string;
  file_url: string | null;
  file_name: string | null;
  is_from_meeting: boolean;
  created_at: string;
}

interface WorkspaceChatProps {
  workspaceId: string;
  userName: string;
  isFromMeeting?: boolean;
}

export const WorkspaceChat = ({ workspaceId, userName, isFromMeeting = false }: WorkspaceChatProps) => {
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`workspace-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'workspace_messages',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          const newMsg = payload.new as WorkspaceMessage;
          setMessages((prev) => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workspace_messages')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from('workspace_messages').insert({
        workspace_id: workspaceId,
        sender_name: userName,
        content: newMessage.trim(),
        message_type: 'text',
        is_from_meeting: isFromMeeting,
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { [key: string]: WorkspaceMessage[] } = {};
  messages.forEach((msg) => {
    const dateKey = new Date(msg.created_at).toDateString();
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
            <div>
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                {/* Date Divider */}
                <div className="flex items-center justify-center my-3">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {formatDate(dateMessages[0].created_at)}
                  </span>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-2">
                  {dateMessages.map((msg) => {
                    const isOwn = msg.sender_name === userName;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {!isOwn && (
                            <div className="text-xs font-medium mb-1 opacity-80 flex items-center gap-1">
                              {msg.sender_name}
                              {msg.is_from_meeting && (
                                <span className="bg-primary/20 text-primary text-[10px] px-1 rounded">Meeting</span>
                              )}
                            </div>
                          )}
                          <p className="text-sm break-words">{msg.content}</p>
                          {msg.file_url && (
                            <a
                              href={msg.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 mt-1 text-xs underline"
                            >
                              <FileIcon className="h-3 w-3" />
                              {msg.file_name || 'File'}
                            </a>
                          )}
                          <div className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
