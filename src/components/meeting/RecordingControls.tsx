import { Circle, Pause, Play, Square, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isUploading: boolean;
  formattedDuration: string;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onDownload: () => void;
}

export const RecordingControls = ({
  isRecording,
  isPaused,
  isUploading,
  formattedDuration,
  onStart,
  onPause,
  onStop,
  onDownload,
}: RecordingControlsProps) => {
  if (isUploading) {
    return (
      <div className="flex items-center gap-2 bg-muted/80 backdrop-blur px-3 py-1.5 rounded-full">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-xs font-medium">Uploading...</span>
      </div>
    );
  }

  if (!isRecording) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onStart}
        className="h-8 gap-1.5 text-xs"
        title="Start Recording"
      >
        <Circle className="h-3.5 w-3.5 text-red-500 fill-red-500" />
        <span className="hidden sm:inline">Record</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-red-500/10 backdrop-blur px-2 py-1 rounded-full">
      {/* Recording indicator */}
      <div className={cn(
        "h-2.5 w-2.5 rounded-full bg-red-500",
        !isPaused && "animate-pulse"
      )} />
      
      {/* Duration */}
      <span className="text-xs font-mono font-medium min-w-[40px] text-center">
        {formattedDuration}
      </span>
      
      {/* Pause/Resume */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onPause}
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? (
          <Play className="h-3.5 w-3.5" />
        ) : (
          <Pause className="h-3.5 w-3.5" />
        )}
      </Button>
      
      {/* Stop */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
        onClick={onStop}
        title="Stop Recording"
      >
        <Square className="h-3.5 w-3.5 fill-current" />
      </Button>
      
      {/* Download option */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onDownload}
        title="Download Locally"
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
