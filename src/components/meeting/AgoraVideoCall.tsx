import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, Users } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';

interface AgoraVideoCallProps {
  appId: string;
  channelName: string;
  userName: string;
  onLeave: () => void;
}

export const AgoraVideoCall = ({ appId, channelName, userName, onLeave }: AgoraVideoCallProps) => {
  const [client] = useState<IAgoraRTCClient>(() => 
    AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
  );
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing Agora with appId:', appId, 'channel:', channelName);
        
        if (!appId || appId.trim() === '') {
          throw new Error('Agora App ID is missing or empty');
        }

        // Generate token from backend
        console.log('Requesting token from backend...');
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('agora-meeting', {
          body: { 
            action: 'generate-token',
            channelName: channelName,
            uid: 0 // Use 0 for auto-generated UID
          },
        });

        if (tokenError) {
          console.error('Token generation error:', tokenError);
          throw new Error('Failed to generate meeting token');
        }

        if (!tokenData.success) {
          throw new Error(tokenData.error || 'Failed to generate token');
        }

        const token = tokenData.token;
        console.log('Token generated successfully');

        // Set up event handlers
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log('Subscribed to user:', user.uid, mediaType);
          
          if (mediaType === 'video') {
            setRemoteUsers(prev => {
              const exists = prev.find(u => u.uid === user.uid);
              if (exists) return prev;
              return [...prev, user];
            });
          }
          
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (user, mediaType) => {
          console.log('User unpublished:', user.uid, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          }
        });

        client.on('user-left', (user) => {
          console.log('User left:', user.uid);
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        // Create local tracks
        console.log('Creating local tracks...');
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        console.log('Local tracks created successfully');

        // Join the channel with token
        console.log('Joining channel with token...');
        const uid = await client.join(appId, channelName, token, null);
        console.log('Joined channel with UID:', uid);

        // Publish local tracks
        await client.publish([audioTrack, videoTrack]);
        console.log('Published local tracks');

        setIsJoined(true);
      } catch (err: any) {
        console.error('Error initializing Agora:', err);
        console.error('Agora error details - appId used:', appId, 'channel:', channelName);
        setError(err.message || 'Failed to join meeting');
      }
    };

    init();

    return () => {
      leaveChannel();
    };
  }, [appId, channelName, client]);

  // Play local video when track is ready
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  const leaveChannel = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    setRemoteUsers([]);
    await client.leave();
    setIsJoined(false);
    onLeave();
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="text-destructive text-center">
          <p className="text-lg font-semibold">Failed to join meeting</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
        <Button onClick={onLeave}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Local Video */}
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            <div 
              ref={localVideoRef} 
              className="w-full h-full"
              style={{ display: isVideoEnabled ? 'block' : 'none' }}
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {userName} (You)
            </div>
          </div>

          {/* Remote Videos */}
          {remoteUsers.map((user) => (
            <RemoteVideoPlayer key={user.uid} user={user} />
          ))}
        </div>

        {remoteUsers.length === 0 && isJoined && (
          <div className="flex items-center justify-center mt-8">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Waiting for others to join...</p>
              <p className="text-sm mt-1">Share the meeting link to invite participants</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isAudioEnabled ? "outline" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-14 h-14"
          >
            {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          
          <Button
            variant={isVideoEnabled ? "outline" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-14 h-14"
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={leaveChannel}
            className="rounded-full w-14 h-14"
          >
            <Phone className="h-6 w-6 rotate-[135deg]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Remote video player component
const RemoteVideoPlayer = ({ user }: { user: IAgoraRTCRemoteUser }) => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.videoTrack && videoRef.current) {
      user.videoTrack.play(videoRef.current);
    }
    
    return () => {
      user.videoTrack?.stop();
    };
  }, [user.videoTrack]);

  return (
    <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
      <div ref={videoRef} className="w-full h-full" />
      {!user.videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {String(user.uid).charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
        User {user.uid}
      </div>
    </div>
  );
};
