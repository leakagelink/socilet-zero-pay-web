import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Mail, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface InboundEmail {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  is_read: boolean;
  received_at: string;
}

interface EmailNotificationDropdownProps {
  onNavigateToEmails?: () => void;
}

const EmailNotificationDropdown = ({ onNavigateToEmails }: EmailNotificationDropdownProps) => {
  const [unreadEmails, setUnreadEmails] = useState<InboundEmail[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchUnreadEmails = async () => {
    const { data, error } = await supabase
      .from('inbound_emails')
      .select('id, from_email, from_name, subject, is_read, received_at')
      .eq('is_read', false)
      .order('received_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setUnreadEmails(data);
    }
  };

  useEffect(() => {
    fetchUnreadEmails();

    // Subscribe to realtime changes for inbound_emails
    const channel = supabase
      .channel('email-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inbound_emails',
        },
        () => {
          fetchUnreadEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (emailId: string) => {
    await supabase
      .from('inbound_emails')
      .update({ is_read: true })
      .eq('id', emailId);
    
    fetchUnreadEmails();
  };

  const markAllAsRead = async () => {
    const ids = unreadEmails.map(e => e.id);
    if (ids.length > 0) {
      await supabase
        .from('inbound_emails')
        .update({ is_read: true })
        .in('id', ids);
      
      fetchUnreadEmails();
    }
  };

  const unreadCount = unreadEmails.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-10 w-10 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-primary/10 hover:border-primary/30 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 sm:w-96 p-0 border-slate-200 dark:border-slate-700 shadow-xl" 
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">New Emails</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs hover:bg-primary/10"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[300px]">
          {unreadEmails.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No new emails</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {unreadEmails.map((email) => (
                <div
                  key={email.id}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  onClick={() => markAsRead(email.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {email.from_name || email.from_email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {email.subject || '(No subject)'}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {onNavigateToEmails && (
          <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                onNavigateToEmails();
              }}
              className="w-full h-8 text-xs justify-center hover:bg-primary/10"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View all emails
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EmailNotificationDropdown;
