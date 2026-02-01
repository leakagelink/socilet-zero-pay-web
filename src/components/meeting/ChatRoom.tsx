import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Send, Paperclip, Smile, Reply, X, Image, File, Video, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { validateChatMessage, logBlockedMessage } from '@/utils/chatValidation';

interface ChatMessage {
  id: string;
  room_id: string;
  sender_name: string;
  sender_id: string | null;
  content: string;
  message_type: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  parent_message_id: string | null;
  is_edited: boolean;
  created_at: string;
  reactions?: MessageReaction[];
}

interface MessageReaction {
  id: string;
  message_id: string;
  user_name: string;
  emoji: string;
}

interface ChatRoomProps {
  meetingId: string;
  userName: string;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

export const ChatRoom = ({ meetingId, userName, onClose }: ChatRoomProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchChatRoom();
  }, [meetingId]);

  useEffect(() => {
    if (!chatRoomId) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`chat-messages-${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    // Subscribe to reactions
    const reactionsChannel = supabase
      .channel(`chat-reactions-${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    // Presence for typing indicators
    const presenceChannel = supabase.channel(`presence-${chatRoomId}`);
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const typing = Object.values(state)
          .flat()
          .filter((p: any) => p.isTyping && p.userName !== userName)
          .map((p: any) => p.userName);
        setTypingUsers(typing);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ userName, isTyping: false });
        }
      });

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reactionsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [chatRoomId, userName]);

  const fetchChatRoom = async () => {
    try {
      const { data: chatRoom, error } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('meeting_id', meetingId)
        .single();

      if (error) throw error;
      
      setChatRoomId(chatRoom.id);
      fetchMessages(chatRoom.id);
      fetchReactions();
    } catch (error: any) {
      console.error('Failed to fetch chat room:', error);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      scrollToBottom();
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('*');

      if (error) throw error;
      setReactions(data || []);
    } catch (error: any) {
      console.error('Failed to fetch reactions:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTyping = async () => {
    if (!chatRoomId) return;
    
    const channel = supabase.channel(`presence-${chatRoomId}`);
    await channel.track({ userName, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      await channel.track({ userName, isTyping: false });
    }, 2000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId) return;

    // Validate message for contact information
    const validation = validateChatMessage(newMessage);
    if (!validation.isValid) {
      // Log the blocked message
      logBlockedMessage({
        senderName: userName,
        messageContent: newMessage,
        blockReason: validation.reason || 'Contact info detected',
        matchedPattern: validation.matchedPattern,
        roomType: 'meeting',
        roomId: chatRoomId,
      });

      toast.error(validation.reason, {
        icon: <ShieldAlert className="h-4 w-4 text-destructive" />,
        duration: 4000,
      });
      return;
    }

    try {
      const { error } = await supabase.from('chat_messages').insert({
        room_id: chatRoomId,
        sender_name: userName,
        content: newMessage.trim(),
        message_type: 'text',
        parent_message_id: replyTo?.id || null,
      });

      if (error) throw error;
      
      setNewMessage('');
      setReplyTo(null);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatRoomId) return;

    // For now, show a message about file upload
    // In production, you'd upload to Supabase Storage
    toast.info('File sharing will be available soon!');
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      // Check if already reacted
      const existingReaction = reactions.find(
        (r) => r.message_id === messageId && r.user_name === userName && r.emoji === emoji
      );

      if (existingReaction) {
        // Remove reaction
        await supabase.from('message_reactions').delete().eq('id', existingReaction.id);
      } else {
        // Add reaction
        await supabase.from('message_reactions').insert({
          message_id: messageId,
          user_name: userName,
          emoji,
        });
      }
      setShowEmojiPicker(null);
    } catch (error: any) {
      console.error('Failed to add reaction:', error);
    }
  };

  const getMessageReactions = (messageId: string) => {
    return reactions.filter((r) => r.message_id === messageId);
  };

  const getParentMessage = (parentId: string | null) => {
    if (!parentId) return null;
    return messages.find((m) => m.id === parentId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold">Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const parentMessage = getParentMessage(message.parent_message_id);
            const messageReactions = getMessageReactions(message.id);
            const isOwn = message.sender_name === userName;

            return (
              <div
                key={message.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
              >
                {/* Reply indicator */}
                {parentMessage && (
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Reply className="h-3 w-3" />
                    Replying to {parentMessage.sender_name}
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {message.sender_name} • {format(new Date(message.created_at), 'HH:mm')}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* File attachment */}
                  {message.file_url && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <File className="h-4 w-4" />
                      <span>{message.file_name}</span>
                    </div>
                  )}
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-1 mt-1">
                  {messageReactions.length > 0 && (
                    <div className="flex gap-1">
                      {Object.entries(
                        messageReactions.reduce((acc: Record<string, number>, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          className="text-xs bg-muted rounded-full px-2 py-0.5 hover:bg-muted/80"
                          onClick={() => addReaction(message.id, emoji)}
                        >
                          {emoji} {count}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setReplyTo(message)}
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowEmojiPicker(message.id)}
                    >
                      <Smile className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Emoji picker */}
                  {showEmojiPicker === message.id && (
                    <div className="absolute bg-card border rounded-lg shadow-lg p-2 flex gap-1 z-10">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          className="text-lg hover:bg-muted rounded p-1"
                          onClick={() => addReaction(message.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-muted flex items-center justify-between">
          <div className="text-xs">
            <span className="text-muted-foreground">Replying to </span>
            <span className="font-medium">{replyTo.sender_name}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyTo(null)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
