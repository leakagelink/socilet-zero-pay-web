import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, X, FileIcon, Image, Loader2 } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadFile = async (file: File): Promise<{ url: string; name: string } | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${workspaceId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('workspace-files')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('workspace-files')
      .getPublicUrl(fileName);
    
    return { url: urlData.publicUrl, name: file.name };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    setUploading(true);
    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let messageType = 'text';

      // Upload file if selected
      if (selectedFile) {
        const result = await uploadFile(selectedFile);
        if (result) {
          fileUrl = result.url;
          fileName = result.name;
          messageType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
        } else {
          toast.error('Failed to upload file');
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase.from('workspace_messages').insert({
        workspace_id: workspaceId,
        sender_name: userName,
        content: newMessage.trim() || (selectedFile ? `Shared: ${selectedFile.name}` : ''),
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        is_from_meeting: isFromMeeting,
      });

      if (error) throw error;
      setNewMessage('');
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-2 sm:p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-center p-4">
            <div>
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                {/* Date Divider */}
                <div className="flex items-center justify-center my-2">
                  <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {formatDate(dateMessages[0].created_at)}
                  </span>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-1.5">
                  {dateMessages.map((msg) => {
                    const isOwn = msg.sender_name === userName;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {!isOwn && (
                            <div className="text-[10px] sm:text-xs font-medium mb-0.5 opacity-80 flex items-center gap-1">
                              {msg.sender_name}
                              {msg.is_from_meeting && (
                                <span className="bg-primary/20 text-primary text-[9px] sm:text-[10px] px-1 rounded">Meeting</span>
                              )}
                            </div>
                          )}
                          <p className="text-xs sm:text-sm break-words leading-relaxed">{msg.content}</p>
                          {/* File/Image display */}
                          {msg.file_url && (
                            msg.message_type === 'image' ? (
                              <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="block mt-1">
                                <img 
                                  src={msg.file_url} 
                                  alt={msg.file_name || 'Image'} 
                                  className="max-w-[200px] max-h-[150px] rounded object-cover"
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs underline"
                              >
                                <FileIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {msg.file_name || 'File'}
                              </a>
                            )
                          )}
                          <div className={`text-[9px] sm:text-[10px] mt-0.5 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
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

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="flex-shrink-0 px-2 sm:px-3 py-2 border-t bg-muted/50">
          <div className="flex items-center gap-2 text-xs">
            {selectedFile.type.startsWith('image/') ? (
              <Image className="h-4 w-4 text-primary" />
            ) : (
              <FileIcon className="h-4 w-4 text-primary" />
            )}
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeSelectedFile}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area - Optimized for mobile keyboard */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t bg-background" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
        />
        <div className="flex gap-1.5 sm:gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-9 sm:h-10 text-sm"
            disabled={uploading}
          />
          <Button 
            onClick={sendMessage} 
            size="icon" 
            disabled={(!newMessage.trim() && !selectedFile) || uploading}
            className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
