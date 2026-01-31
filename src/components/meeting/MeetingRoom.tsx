import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Video, Users, Link, Copy, MessageSquare, Phone } from 'lucide-react';
import { ChatRoom } from './ChatRoom';
import { AgoraVideoCall } from './AgoraVideoCall';

interface Meeting {
  id: string;
  room_name: string;
  room_url: string;
  title: string;
  description: string;
  created_by: string;
  is_active: boolean;
  participants_count: number;
  created_at: string;
}

const AGORA_APP_ID = '20a16fef851d4594822620e18dbf78b9';

export const MeetingRoom = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    createdBy: '',
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('agora-meeting', {
        body: { action: 'get-rooms' },
      });

      if (error) throw error;
      if (data.success) {
        setMeetings(data.meetings || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch meetings:', error);
    }
  };

  const createMeeting = async () => {
    if (!formData.title.trim()) {
      toast.error('Meeting title is required');
      return;
    }

    setCreating(true);
    try {
      const roomName = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase.functions.invoke('agora-meeting', {
        body: {
          action: 'create-room',
          roomName,
          title: formData.title,
          description: formData.description,
          createdBy: formData.createdBy || 'Anonymous',
        },
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success('Meeting created successfully!');
        setFormData({ title: '', description: '', createdBy: '' });
        fetchMeetings();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Failed to create meeting:', error);
      toast.error(`Failed to create meeting: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const joinMeeting = (meeting: Meeting) => {
    if (!userName.trim()) {
      toast.error('Please enter your name first');
      return;
    }
    setActiveMeeting(meeting);
  };

  const leaveMeeting = () => {
    setActiveMeeting(null);
    setShowChat(false);
  };

  const copyLink = (meeting: Meeting) => {
    const meetingLink = `${window.location.origin}/meetings?channel=${meeting.room_name}`;
    navigator.clipboard.writeText(meetingLink);
    toast.success('Meeting link copied!');
  };

  if (activeMeeting) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Meeting Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{activeMeeting.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyLink(activeMeeting)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showChat ? "default" : "outline"}
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button variant="destructive" size="sm" onClick={leaveMeeting}>
              <Phone className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>

        {/* Meeting Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Area */}
          <div className={`flex-1 ${showChat ? 'w-2/3' : 'w-full'}`}>
            <AgoraVideoCall
              appId={AGORA_APP_ID}
              channelName={activeMeeting.room_name}
              userName={userName}
              onLeave={leaveMeeting}
            />
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-1/3 border-l bg-card">
              <ChatRoom
                meetingId={activeMeeting.id}
                userName={userName}
                onClose={() => setShowChat(false)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* User Name Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter your name to join meetings"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Create Meeting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Create New Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Meeting Title *</Label>
              <Input
                placeholder="e.g., Project Discussion"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Your Name</Label>
              <Input
                placeholder="Host name"
                value={formData.createdBy}
                onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="What's this meeting about?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button onClick={createMeeting} disabled={creating}>
            {creating ? 'Creating...' : 'Create Meeting'}
          </Button>
        </CardContent>
      </Card>

      {/* Active Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Meetings ({meetings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No active meetings. Create one above to get started!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="border">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {meeting.description || 'No description'}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created by: {meeting.created_by}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => joinMeeting(meeting)}
                        disabled={!userName.trim()}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyLink(meeting)}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
