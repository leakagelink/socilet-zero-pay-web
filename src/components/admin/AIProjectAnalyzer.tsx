import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, Trash2, Send, Loader2, Bot, User, FileText, Download, 
  MessageSquare, FolderOpen, X, Upload, Sparkles, RefreshCw,
  FileDown, Image, Menu, ArrowLeft, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  file_name?: string;
  file_url?: string;
  created_at: string;
}

interface Session {
  id: string;
  session_name: string;
  client_name: string | null;
  project_type: string | null;
  status: string;
  generated_document: any;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-project-analyzer`;

const AIProjectAnalyzer = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [newSessionName, setNewSessionName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id);
      setIsMobileSidebarOpen(false); // Close sidebar on session select (mobile)
    }
  }, [activeSession?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_project_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const createSession = async () => {
    if (!newSessionName.trim()) {
      toast.error('Session name is required');
      return;
    }

    setIsCreatingSession(true);
    try {
      let logoUrl = null;

      // Upload logo if provided
      if (logoFile) {
        const fileName = `logos/${Date.now()}-${logoFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ai-documents')
          .upload(fileName, logoFile);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from('ai-documents').getPublicUrl(fileName);
          logoUrl = urlData.publicUrl;
        }
      }

      const { data, error } = await supabase
        .from('ai_project_sessions')
        .insert({
          session_name: newSessionName.trim(),
          client_name: newClientName.trim() || null,
          logo_url: logoUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setSessions([data, ...sessions]);
      setActiveSession(data);
      setMessages([]);
      setNewSessionName('');
      setNewClientName('');
      setLogoFile(null);
      setLogoPreview(null);
      setIsNewSessionDialogOpen(false);
      toast.success('Session created');
    } catch (err: any) {
      console.error('Error creating session:', err);
      toast.error(err.message || 'Failed to create session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Delete this session and all messages?')) return;

    try {
      const { error } = await supabase
        .from('ai_project_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== sessionId));
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
        setMessages([]);
      }
      toast.success('Session deleted');
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Failed to delete session');
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      // Read file content for text-based files
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        return text;
      }
      
      // For PDFs and other files, just return the name (actual parsing would need additional processing)
      return `[File uploaded: ${file.name}]\n\nPlease analyze this file and provide insights based on the requirements.`;
    } catch (err) {
      console.error('Error reading file:', err);
      return null;
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (type: 'chat' | 'analyze' | 'generate_document' = 'chat') => {
    if (!activeSession) {
      toast.error('Please select or create a session first');
      return;
    }

    let messageContent = inputMessage.trim();
    
    // Handle file upload
    if (uploadedFile) {
      const fileContent = await handleFileUpload(uploadedFile);
      if (fileContent) {
        messageContent = `${messageContent}\n\n--- File Content (${uploadedFile.name}) ---\n${fileContent}`;
      }
      setUploadedFile(null);
    }

    if (!messageContent && type === 'chat') {
      toast.error('Please enter a message');
      return;
    }

    // Add special prompts based on type
    if (type === 'analyze') {
      messageContent = `Please analyze the following project requirements in detail:\n\n${messageContent || 'Based on our conversation so far, provide a comprehensive project analysis.'}`;
    } else if (type === 'generate_document') {
      messageContent = `Generate a detailed project proposal document based on our entire conversation. Include all the analysis, timeline, costs, and recommendations we discussed.`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      // Save user message
      await supabase.from('ai_session_messages').insert({
        session_id: activeSession.id,
        role: 'user',
        content: messageContent,
      });

      // Prepare messages for AI
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Stream AI response
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          type: type === 'chat' ? 'chat' : type,
          projectContext: activeSession.client_name ? `Client: ${activeSession.client_name}` : undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        if (response.status === 402) {
          throw new Error('Payment required. Please add credits.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      // Add placeholder for assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE data
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Save assistant message
      await supabase.from('ai_session_messages').insert({
        session_id: activeSession.id,
        role: 'assistant',
        content: assistantContent,
      });

      // Update session timestamp
      await supabase
        .from('ai_project_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeSession.id);

    } catch (err: any) {
      console.error('Error sending message:', err);
      toast.error(err.message || 'Failed to send message');
      // Remove the failed user message
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const exportDocument = (format: 'txt' | 'md') => {
    if (messages.length === 0) {
      toast.error('No conversation to export');
      return;
    }

    let content = `# Project Analysis Session\n`;
    content += `## Session: ${activeSession?.session_name}\n`;
    content += `## Client: ${activeSession?.client_name || 'N/A'}\n`;
    content += `## Date: ${new Date().toLocaleDateString()}\n\n---\n\n`;

    messages.forEach(msg => {
      const role = msg.role === 'user' ? '👤 User' : '🤖 AI';
      content += `### ${role}\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSession?.session_name || 'project'}-analysis.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  // Sessions list component for reuse
  const SessionsList = ({ onClose }: { onClose?: () => void }) => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Sessions</span>
        </div>
        <Dialog open={isNewSessionDialogOpen} onOpenChange={setIsNewSessionDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>New Analysis Session</DialogTitle>
              <DialogDescription>Create a new session for project analysis</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Session Name *</Label>
                <Input 
                  value={newSessionName} 
                  onChange={(e) => setNewSessionName(e.target.value)} 
                  placeholder="e.g., E-commerce Project"
                />
              </div>
              <div>
                <Label>Client Name</Label>
                <Input 
                  value={newClientName} 
                  onChange={(e) => setNewClientName(e.target.value)} 
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>Company Logo (Optional)</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => logoInputRef.current?.click()}
                    className="gap-2"
                    size="sm"
                  >
                    <Image className="h-4 w-4" />
                    Upload
                  </Button>
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo preview" className="h-10 w-10 object-contain rounded border" />
                  )}
                </div>
              </div>
              <Button onClick={createSession} disabled={isCreatingSession} className="w-full gap-2">
                {isCreatingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Create Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No sessions yet</p>
              <p className="text-xs">Create one to start</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer transition-all group ${
                  activeSession?.id === session.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
                onClick={() => {
                  setActiveSession(session);
                  onClose?.();
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{session.session_name}</p>
                    {session.client_name && (
                      <p className={`text-xs truncate ${activeSession?.id === session.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {session.client_name}
                      </p>
                    )}
                    <p className={`text-xs mt-1 ${activeSession?.id === session.id ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 opacity-0 group-hover:opacity-100 ${
                      activeSession?.id === session.id ? 'text-primary-foreground hover:bg-primary-foreground/20' : 'text-destructive'
                    }`}
                    onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-280px)] min-h-[500px] lg:min-h-[600px] gap-4">
      {/* Desktop Sidebar */}
      <Card className="hidden lg:flex w-72 xl:w-80 flex-col">
        <SessionsList />
      </Card>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden flex items-center gap-2 mb-2">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="h-4 w-4" />
              Sessions
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SessionsList onClose={() => setIsMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        
        {activeSession && (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{activeSession.session_name}</p>
            {activeSession.client_name && (
              <p className="text-xs text-muted-foreground truncate">{activeSession.client_name}</p>
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {activeSession ? (
          <>
            {/* Chat Header - Desktop */}
            <CardHeader className="hidden lg:block pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{activeSession.session_name}</CardTitle>
                  {activeSession.client_name && (
                    <p className="text-sm text-muted-foreground">Client: {activeSession.client_name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportDocument('md')} className="gap-1">
                    <FileDown className="h-4 w-4" />
                    <span className="hidden xl:inline">Export MD</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportDocument('txt')} className="gap-1">
                    <Download className="h-4 w-4" />
                    <span className="hidden xl:inline">Export TXT</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Mobile Export Buttons */}
            <div className="lg:hidden flex gap-2 p-3 border-b">
              <Button variant="outline" size="sm" onClick={() => exportDocument('md')} className="gap-1 flex-1">
                <FileDown className="h-4 w-4" />
                MD
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportDocument('txt')} className="gap-1 flex-1">
                <Download className="h-4 w-4" />
                TXT
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 lg:p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <Bot className="h-12 w-12 lg:h-16 lg:w-16 text-primary/30 mb-4" />
                  <h3 className="text-base lg:text-lg font-medium mb-2">Start Your Analysis</h3>
                  <p className="text-muted-foreground text-xs lg:text-sm max-w-md mb-4 lg:mb-6">
                    Describe your project requirements. I'll help analyze and create detailed proposals.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 text-xs" onClick={() => setInputMessage('E-commerce website with payment, products & auth')}>
                      E-commerce
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 text-xs" onClick={() => setInputMessage('CRM system with leads, tasks & reports')}>
                      CRM
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 text-xs" onClick={() => setInputMessage('Portfolio website with blog & admin panel')}>
                      Portfolio
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 lg:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] lg:max-w-[80%] rounded-2xl px-3 py-2 lg:px-4 lg:py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted prose prose-sm max-w-none dark:prose-invert'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => <h1 className="text-base lg:text-lg font-bold mt-4 mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm lg:text-base font-semibold mt-3 mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-xs lg:text-sm font-medium mt-2 mb-1">{children}</h3>,
                              p: ({ children }) => <p className="mb-2 text-xs lg:text-sm">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc ml-4 mb-2 text-xs lg:text-sm">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 text-xs lg:text-sm">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              table: ({ children }) => <div className="overflow-x-auto"><table className="w-full border-collapse my-2 text-xs lg:text-sm">{children}</table></div>,
                              th: ({ children }) => <th className="border px-2 py-1 bg-muted font-medium text-left">{children}</th>,
                              td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              code: ({ children }) => <code className="bg-muted-foreground/10 px-1 rounded text-xs">{children}</code>,
                            }}
                          >
                            {msg.content || '...'}
                          </ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap text-xs lg:text-sm">{msg.content}</p>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 lg:p-4 border-t">
              {uploadedFile && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-xs lg:text-sm flex-1 truncate">{uploadedFile.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setUploadedFile(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".txt,.md,.pdf,.doc,.docx"
                  onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Project requirements..."
                  className="min-h-[50px] lg:min-h-[60px] max-h-[100px] lg:max-h-[120px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage('chat');
                    }
                  }}
                  disabled={isSending}
                />
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <Button 
                    onClick={() => sendMessage('chat')} 
                    disabled={isSending || (!inputMessage.trim() && !uploadedFile)}
                    size="icon"
                    className="h-7 lg:h-8"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                  <Button 
                    onClick={() => sendMessage('analyze')} 
                    disabled={isSending}
                    size="icon"
                    variant="secondary"
                    className="h-7 lg:h-8"
                    title="Deep Analysis"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => sendMessage('generate_document')} 
                    disabled={isSending || messages.length === 0}
                    size="icon"
                    variant="outline"
                    className="h-7 lg:h-8"
                    title="Generate Document"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-2 hidden sm:block">
                💡 Enter = send • ✨ Analysis • 📄 Document
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 lg:p-8">
            <Bot className="h-16 w-16 lg:h-20 lg:w-20 text-primary/20 mb-4 lg:mb-6" />
            <h2 className="text-lg lg:text-xl font-semibold mb-2">AI Project Analyzer</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-4 lg:mb-6">
              Create a session to analyze projects. Generate proposals with tech recommendations, timelines & costs.
            </p>
            <Button onClick={() => setIsNewSessionDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Session
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIProjectAnalyzer;
