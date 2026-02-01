import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MessageSquare, FileIcon, Video, ArrowLeft, Copy, Users, Upload, Trash2 } from 'lucide-react';
import { WorkspaceChat } from '@/components/meeting/WorkspaceChat';

interface ProjectWorkspace {
  id: string;
  project_code: string;
  title: string;
  description: string | null;
  created_by: string | null;
  is_active: boolean;
  created_at: string;
}

interface WorkspaceFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

const ProjectWorkspace = () => {
  const { projectCode } = useParams<{ projectCode: string }>();
  const navigate = useNavigate();
  
  const [workspace, setWorkspace] = useState<ProjectWorkspace | null>(null);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (projectCode) {
      fetchWorkspace();
    }
  }, [projectCode]);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_workspaces')
        .select('*')
        .eq('project_code', projectCode)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setNotFound(true);
        return;
      }
      
      setWorkspace(data);
      fetchFiles(data.id);
    } catch (error: any) {
      console.error('Failed to fetch workspace:', error);
      toast.error('Failed to load workspace');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (workspaceId: string) => {
    try {
      const { data, error } = await supabase
        .from('workspace_files')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error('Failed to fetch files:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !workspace) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const fileName = `${workspace.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('email-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('email-assets')
        .getPublicUrl(fileName);

      // Save file record
      const { error: dbError } = await supabase.from('workspace_files').insert({
        workspace_id: workspace.id,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userName,
      });

      if (dbError) throw dbError;

      toast.success('File uploaded successfully!');
      fetchFiles(workspace.id);
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const copyProjectCode = () => {
    if (workspace) {
      navigator.clipboard.writeText(workspace.project_code);
      toast.success('Project code copied!');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">Workspace Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project code "{projectCode}" doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/meetings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!nameSet) {
    return (
      <>
        <Helmet>
          <title>Project {projectCode} | Socilet</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enter Your Name
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Please enter your name to access the project workspace.
              </p>
              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setNameSet(true)}
                />
              </div>
              <Button 
                onClick={() => setNameSet(true)} 
                disabled={!userName.trim()}
                className="w-full"
              >
                Access Workspace
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{workspace?.title || 'Project'} - {projectCode} | Socilet</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/meetings')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="font-semibold text-lg">{workspace?.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Project ID:</span>
                    <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                      {workspace?.project_code}
                    </code>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyProjectCode}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{userName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-4">
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="chat" className="flex-1 sm:flex-none">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1 sm:flex-none">
                <FileIcon className="h-4 w-4 mr-2" />
                Files ({files.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0">
              <Card className="h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)]">
                {workspace && (
                  <WorkspaceChat
                    workspaceId={workspace.id}
                    userName={userName}
                    isFromMeeting={false}
                  />
                )}
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Shared Files</CardTitle>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                      <Button size="sm" disabled={uploading} asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload File'}
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  {files.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No files shared yet.</p>
                      <p className="text-sm">Upload files to share with your team.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FileIcon className="h-8 w-8 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{file.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.file_size)} • Uploaded by {file.uploaded_by}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.file_url, '_blank')}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProjectWorkspace;
