import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TakeawayModalProps {
  title: string;
  onClose: () => void;
}

export default function TakeawayModal({ title, onClose }: TakeawayModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 bg-stone-900 border border-stone-700 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground/90 mb-6 pr-8">
          {title}
        </h2>

        {/* Placeholder content */}
        <div className="space-y-4 text-foreground/80">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="pt-2">
            <a 
              href="https://lmt.lv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-500 underline"
            >
              Learn more at lmt.lv
            </a>
          </p>
        </div>

        {/* Close button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={onClose}
            size="lg"
            className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
