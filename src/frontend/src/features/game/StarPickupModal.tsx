import { useEffect } from 'react';

interface StarPickupModalProps {
  title: string;
  description: string;
  isCompletionPickup: boolean;
  onDismiss: () => void;
}

export default function StarPickupModal({ title, description, isCompletionPickup, onDismiss }: StarPickupModalProps) {
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
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-stone-900/80 backdrop-blur-sm modal-fade-in">
      <div className="bg-stone-800 border-2 border-stone-600 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">
          {title}
        </h2>
        <div className="text-stone-200 leading-relaxed space-y-3 mb-6">
          <p>{description}</p>
          
          {/* Completion message section - only shown for 7th unique pickup */}
          {isCompletionPickup && (
            <div className="mt-3">
              <p>
                <span className="font-bold">Congratulations!</span> 🌟
                <br />
                You have successfully taught Barnabus the key components to ensure his goal is safely distanced from his reach.
              </p>
            </div>
          )}
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
