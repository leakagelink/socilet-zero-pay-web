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

  const startRecording = useCallback(async () => {
    try {
      // Get screen + audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true,
      });

      // Try to get microphone audio
      let audioStream: MediaStream | null = null;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.log('Microphone access denied, recording without mic audio');
      }

      // Combine streams
      const tracks = [...displayStream.getTracks()];
      if (audioStream) {
        tracks.push(...audioStream.getAudioTracks());
      }
      
      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // Setup MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality
      });

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stopTimer();
        await uploadRecording();
      };

      // Handle if user stops screen share
      displayStream.getVideoTracks()[0].onended = () => {
        if (state.isRecording) {
          stopRecording();
        }
      };

      recorder.start(1000); // Collect data every second
      mediaRecorderRef.current = recorder;
      
      setState(prev => ({ ...prev, isRecording: true, duration: 0 }));
      startTimer();
      toast.success('Recording started');
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Screen sharing permission denied');
      } else {
        toast.error(`Failed to start recording: ${error.message}`);
      }
    }
  }, [state.isRecording, startTimer, stopTimer]);

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
      setState(prev => ({ ...prev, isRecording: false, isPaused: false }));
    }
  }, []);

  const uploadRecording = useCallback(async () => {
    if (chunksRef.current.length === 0) {
      toast.error('No recording data');
      return;
    }

    setState(prev => ({ ...prev, isUploading: true }));
    toast.info('Uploading recording to cloud...');

    try {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const file = new File([blob], `${meetingTitle}-${Date.now()}.webm`, { type: 'video/webm' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('meetingTitle', meetingTitle);
      if (workspaceId) {
        formData.append('workspaceId', workspaceId);
      }

      const { data, error } = await supabase.functions.invoke('cloudinary-upload', {
        body: formData,
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Recording uploaded successfully!');
        onUploadComplete?.(data.optimizedUrl || data.url);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
      
      // Offer local download as fallback
      downloadLocally();
    } finally {
      setState(prev => ({ ...prev, isUploading: false }));
      chunksRef.current = [];
    }
  }, [meetingTitle, workspaceId, onUploadComplete]);

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

  const formatDuration = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
