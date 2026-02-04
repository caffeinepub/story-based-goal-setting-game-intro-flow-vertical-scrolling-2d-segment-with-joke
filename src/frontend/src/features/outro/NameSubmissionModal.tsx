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
        className="bg-stone-900 border-stone-700 text-stone-100 max-w-md modal-fade-in"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-stone-100">
            Join the Wall of Fame
          </DialogTitle>
          <DialogDescription className="text-stone-300">
            Enter your name to receive your certificate of completion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-stone-200">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name"
              className="bg-stone-800 border-stone-600 text-stone-100 placeholder:text-stone-500"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Error message display */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
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
              className="rounded-[100px] bg-transparent border border-stone-300 text-stone-100 hover:bg-stone-800 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Continue'}
            </Button>
            <Button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              size="lg"
              variant="ghost"
              className="rounded-[100px] text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 px-8"
            >
              Skip and take me to Wall of Fame
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
