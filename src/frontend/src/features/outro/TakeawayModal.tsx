import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TAKEAWAYS } from './takeawaysContent';

interface TakeawayModalProps {
  title: string;
  onClose: () => void;
}

// Normalize title by removing trailing period for lookup
function normalizeTitle(title: string): string {
  return title.replace(/\.$/, '');
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

  const normalizedTitle = normalizeTitle(title);
  const content = TAKEAWAYS.find(t => t.title === normalizedTitle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-fade-in">
      {/* Overlay with stronger blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal content with lighter background */}
      <div 
        className="relative z-10 border-2 border-purple-400/50 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, oklch(0.40 0.10 280) 0%, oklch(0.35 0.12 290) 50%, oklch(0.38 0.10 270) 100%)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6 pr-8">
          {title}
        </h2>

        {/* Content */}
        <div className="space-y-4 text-white/95">
          <p>
            {content?.body || 'Content not available.'}
          </p>
          {content?.link && (
            <p className="pt-2">
              <a 
                href={content.link.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-purple-100 underline"
              >
                {content.link.text}
              </a>
            </p>
          )}
        </div>

        {/* Close button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={onClose}
            size="lg"
            className="rounded-[100px] bg-transparent border border-white/70 text-white hover:bg-white/10 px-8"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
