import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  isUploading: boolean;
}

interface UseRecorderOptions {
  meetingTitle: string;
  workspaceId?: string;
  onUploadComplete?: (url: string) => void;
}

export const useMeetingRecorder = (options: UseRecorderOptions) => {
  const { meetingTitle, workspaceId, onUploadComplete } = options;
  
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    isUploading: false,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const downloadLocally = useCallback(() => {
    if (chunksRef.current.length === 0) return;
    
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingTitle}-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recording downloaded locally');
  }, [meetingTitle]);

  const uploadRecording = useCallback(async () => {
    if (chunksRef.current.length === 0) {
      toast.error('No recording data');
      return;
    }

    setState(prev => ({ ...prev, isUploading: true }));
    toast.info('Uploading recording to Cloudinary...');

    try {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const fileName = `${meetingTitle}-${Date.now()}.webm`;
      const file = new File([blob], fileName, { type: 'video/webm' });

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('workspaceId', workspaceId || 'recordings');
      formData.append('uploadType', 'video');

      // Get Supabase URL and key for edge function call
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/cloudinary-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('Recording uploaded to Cloudinary!');
      console.log('Recording uploaded:', data.url);
      onUploadComplete?.(data.optimizedUrl || data.url);
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
      
      // Offer local download as fallback
      toast.info('Downloading recording locally as backup...');
      downloadLocally();
    } finally {
      setState(prev => ({ ...prev, isUploading: false }));
      chunksRef.current = [];
    }
  }, [meetingTitle, workspaceId, onUploadComplete, downloadLocally]);

  const startRecording = useCallback(async () => {
    try {
      // Get screen + system audio (tab audio)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Check if system audio was captured
      const hasSystemAudio = displayStream.getAudioTracks().length > 0;
      console.log('System audio captured:', hasSystemAudio);

      // Try to get microphone audio
      let micStream: MediaStream | null = null;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        console.log('Microphone audio captured');
      } catch (e) {
        console.log('Microphone access denied, recording without mic audio');
        toast.info('Microphone not available - recording system audio only');
      }

      // Create AudioContext to mix audio streams
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const destination = audioContext.createMediaStreamDestination();

      // Add system audio if available
      if (hasSystemAudio) {
        const systemSource = audioContext.createMediaStreamSource(
          new MediaStream(displayStream.getAudioTracks())
        );
        systemSource.connect(destination);
      }

      // Add microphone audio if available
      if (micStream) {
        const micSource = audioContext.createMediaStreamSource(micStream);
        // Add slight gain to microphone to balance with system audio
        const micGain = audioContext.createGain();
        micGain.gain.value = 1.2;
        micSource.connect(micGain);
        micGain.connect(destination);
      }

      // Combine video track with mixed audio
      const videoTrack = displayStream.getVideoTracks()[0];
      const mixedAudioTrack = destination.stream.getAudioTracks()[0];
      
      const tracks: MediaStreamTrack[] = [videoTrack];
      if (mixedAudioTrack) {
        tracks.push(mixedAudioTrack);
      }
      
      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // Store original streams for cleanup
      const originalDisplayStream = displayStream;
      const originalMicStream = micStream;

      // Log what we're recording
      console.log('Recording tracks:', {
        video: combinedStream.getVideoTracks().length,
        audio: combinedStream.getAudioTracks().length,
      });

      // Setup MediaRecorder with audio codec support
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      console.log('Using mimeType:', mimeType);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for video
        audioBitsPerSecond: 128000, // 128 kbps for audio
      });

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stopTimer();
        // Close audio context
        audioContext.close();
        // Stop all original streams
        originalDisplayStream.getTracks().forEach(track => track.stop());
        originalMicStream?.getTracks().forEach(track => track.stop());
        await uploadRecording();
      };

      // Handle if user stops screen share
      videoTrack.onended = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          streamRef.current?.getTracks().forEach(track => track.stop());
          setState(prev => ({ ...prev, isRecording: false, isPaused: false }));
        }
      };

      recorder.start(1000); // Collect data every second
      mediaRecorderRef.current = recorder;
      
      setState(prev => ({ ...prev, isRecording: true, duration: 0 }));
      startTimer();
      
      const audioStatus = hasSystemAudio || micStream ? 'with audio' : 'video only';
      toast.success(`Recording started (${audioStatus})`);
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Screen sharing permission denied');
      } else {
        toast.error(`Failed to start recording: ${error.message}`);
      }
    }
  }, [startTimer, stopTimer, uploadRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      if (state.isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setState(prev => ({ ...prev, isPaused: false }));
        toast.success('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setState(prev => ({ ...prev, isPaused: true }));
        toast.info('Recording paused');
      }
    }
  }, [state.isRecording, state.isPaused, startTimer, stopTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      audioContextRef.current?.close();
      setState(prev => ({ ...prev, isRecording: false, isPaused: false }));
    }
  }, []);

  return {
    ...state,
    formattedDuration: formatDuration(state.duration),
    startRecording,
    pauseRecording,
    stopRecording,
    downloadLocally,
  };
};
