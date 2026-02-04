import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface NameSubmissionModalProps {
  open: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onSkip: () => void;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function NameSubmissionModal({
  open,
  name,
  onNameChange,
  onSubmit,
  onClose,
  onSkip,
  isLoading,
  error,
  onRetry,
}: NameSubmissionModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={undefined}>
      <DialogContent 
        className="border-2 border-purple-400/50 text-white max-w-md modal-fade-in"
        style={{
          background: 'linear-gradient(135deg, oklch(0.40 0.10 280) 0%, oklch(0.35 0.12 290) 50%, oklch(0.38 0.10 270) 100%)'
        }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            Join the Wall of Fame
          </DialogTitle>
          <DialogDescription className="text-white/80">
            Enter your name to receive your certificate of completion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Error message display */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-200">{error}</p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="text-sm text-red-300 underline hover:text-red-200 mt-1"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={!name.trim() || isLoading}
              className="rounded-[100px] bg-transparent border border-white/70 text-white hover:bg-white/10 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Continue'}
            </Button>
            <Button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              size="lg"
              variant="ghost"
              className="rounded-[100px] text-white/70 hover:text-white hover:bg-white/5 px-8"
            >
              Skip and take me to Wall of Fame
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
