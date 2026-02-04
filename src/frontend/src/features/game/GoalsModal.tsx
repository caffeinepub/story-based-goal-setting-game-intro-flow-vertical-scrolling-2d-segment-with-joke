import { useEffect } from 'react';

interface GoalsModalProps {
  onDismiss: () => void;
}

export default function GoalsModal({ onDismiss }: GoalsModalProps) {
  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-stone-900/80 backdrop-blur-sm">
      <div className="bg-stone-800 border-2 border-stone-600 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">
          Donald has new goals!
        </h2>
        <div className="text-stone-200 leading-relaxed space-y-3 mb-6">
          <p>
            This year Donald has decided to take on 4 new goals. Last year it was 6, however he managed to fulfill… 0.
          </p>
          <p>
            Your target is to help Donald to once again accomplish none of his goals. Navigate Donald through the tunnels of the 21st century, find devices and advices to make achieving the goals as hard as possible.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="w-full py-3 px-6 bg-transparent border-2 border-amber-500 text-amber-500 rounded-[100px] font-medium hover:bg-amber-500/10 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
