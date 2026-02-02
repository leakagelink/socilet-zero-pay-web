import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  ILocalVideoTrack
} from 'agora-rtc-sdk-ng';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, Users, Monitor, MonitorOff } from 'lucide-react';

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
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLDivElement>(null);
  const screenShareRef = useRef<HTMLDivElement>(null);

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
          console.log('User published:', user.uid, mediaType);
          
          try {
            await client.subscribe(user, mediaType);
            console.log('Subscribed to user:', user.uid, mediaType);
          } catch (subscribeError) {
            console.error('Failed to subscribe to user:', user.uid, mediaType, subscribeError);
            return;
          }
          
          // Add user to remoteUsers list if not already present (for both video and audio)
          setRemoteUsers(prev => {
            const exists = prev.find(u => u.uid === user.uid);
            if (exists) {
              // Update existing user with new track
              return prev.map(u => u.uid === user.uid ? user : u);
            }
            return [...prev, user];
          });
          
          // Play audio track immediately after subscribing
          if (mediaType === 'audio' && user.audioTrack) {
            console.log('Playing audio for user:', user.uid);
            user.audioTrack.play();
          }
        });

        client.on('user-unpublished', (user, mediaType) => {
          console.log('User unpublished:', user.uid, mediaType);
          // Only remove user from list if they unpublish video (they might still have audio)
          // But keep them if they still have other tracks
          if (mediaType === 'video') {
            // Update the user object in the list
            setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? user : u));
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
    screenTrack?.close();
    localAudioTrack?.close();
    localVideoTrack?.close();
    setRemoteUsers([]);
    setIsScreenSharing(false);
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

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenTrack) {
        await client.unpublish(screenTrack);
        screenTrack.close();
        setScreenTrack(null);
      }
      setIsScreenSharing(false);
      
      // Re-enable camera if it was enabled
      if (localVideoTrack && isVideoEnabled) {
        await client.publish(localVideoTrack);
      }
    } else {
      // Start screen sharing
      try {
        const screenVideoTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_1',
        }, 'disable');
        
        // Handle if user cancels screen share picker
        if (!screenVideoTrack) {
          return;
        }

        // Handle screen track as single track
        const track = Array.isArray(screenVideoTrack) ? screenVideoTrack[0] : screenVideoTrack;
        
        // Listen for screen share stop (when user clicks browser's stop button)
        track.on('track-ended', async () => {
          await client.unpublish(track);
          track.close();
          setScreenTrack(null);
          setIsScreenSharing(false);
          
          // Re-enable camera
          if (localVideoTrack && isVideoEnabled) {
            await client.publish(localVideoTrack);
          }
        });

        // Unpublish camera, publish screen
        if (localVideoTrack) {
          await client.unpublish(localVideoTrack);
        }
        await client.publish(track);
        
        setScreenTrack(track);
        setIsScreenSharing(true);
        
        // Play screen share locally
        if (screenShareRef.current) {
          track.play(screenShareRef.current);
        }
      } catch (err: any) {
        console.error('Screen share error:', err);
        // User cancelled or error occurred
        if (err.message?.includes('Permission denied') || err.name === 'NotAllowedError') {
          // User cancelled - do nothing
          return;
        }
      }
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
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden bg-background">
      {/* Video Grid */}
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 auto-rows-fr max-w-full">
          {/* Screen Share Display */}
          {isScreenSharing && (
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video sm:col-span-2 lg:col-span-2">
              <div 
                ref={screenShareRef} 
                className="w-full h-full [&_video]:!object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs sm:text-sm flex items-center gap-1">
                <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
                Screen
              </div>
            </div>
          )}

          {/* Local Video */}
          <div className={`relative bg-muted rounded-lg overflow-hidden aspect-video ${isScreenSharing ? 'sm:col-span-1' : ''}`}>
            <div 
              ref={localVideoRef} 
              className="w-full h-full [&_video]:!object-cover"
              style={{ display: isVideoEnabled && !isScreenSharing ? 'block' : 'none' }}
            />
            {(!isVideoEnabled || isScreenSharing) && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg sm:text-2xl font-bold text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-black/60 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-sm">
              {userName} (You)
            </div>
          </div>

          {/* Remote Videos */}
          {remoteUsers.map((user) => (
            <RemoteVideoPlayer key={user.uid} user={user} />
          ))}
        </div>

        {remoteUsers.length === 0 && isJoined && !isScreenSharing && (
          <div className="flex items-center justify-center mt-4 sm:mt-8">
            <div className="text-center text-muted-foreground px-4">
              <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm sm:text-base">Waiting for others...</p>
              <p className="text-xs sm:text-sm mt-1">Share the meeting link</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls - Fixed at bottom with safe area for mobile */}
      <div className="flex-shrink-0 p-2 sm:p-4 border-t bg-card" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Button
            variant={isAudioEnabled ? "outline" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-11 h-11 sm:w-14 sm:h-14 p-0"
          >
            {isAudioEnabled ? <Mic className="h-5 w-5 sm:h-6 sm:w-6" /> : <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
          
          <Button
            variant={isVideoEnabled ? "outline" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-11 h-11 sm:w-14 sm:h-14 p-0"
            disabled={isScreenSharing}
          >
            {isVideoEnabled ? <Video className="h-5 w-5 sm:h-6 sm:w-6" /> : <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-11 h-11 sm:w-14 sm:h-14 p-0 hidden sm:flex"
          >
            {isScreenSharing ? <MonitorOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Monitor className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={leaveChannel}
            className="rounded-full w-11 h-11 sm:w-14 sm:h-14 p-0"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6 rotate-[135deg]" />
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
      <div ref={videoRef} className="w-full h-full [&_video]:!object-cover" />
      {!user.videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg sm:text-2xl font-bold text-primary">
              {String(user.uid).charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-black/60 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-sm">
        User {user.uid}
      </div>
    </div>
  );
};
