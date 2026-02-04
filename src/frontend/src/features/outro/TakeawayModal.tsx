import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TakeawayModalProps {
  title: string;
  onClose: () => void;
}

// Content mapping for each takeaway - normalized keys without trailing periods
const TAKEAWAY_CONTENT: Record<string, { body: string; link?: { url: string; text: string } }> = {
  'Set clear and specific goals': {
    body: 'Replace vague and ambiguous targets with ultra-specific, measurable outcomes. Specific goals focus attention and help track progress. Define exactly what "done" looks like so your brain doesn\'t have to guess (e.g., "Save €300/month for 6 months").',
    link: {
      url: 'https://www.eval.fr/wp-content/uploads/2020/01/S.M.A.R.T-Way-Management-Review-eval.fr_.pdf',
      text: 'Learn more from S.M.A.R.T. study by George T. Doran'
    }
  },
  'Adopt a flexible, progress-focused mindset': {
    body: 'Abandon "All-or-Nothing" for "Always Something." Adopt a "never miss twice" rule. If you can\'t do a 60-minute workout, do 5 minutes. instead Consistency always beats intensity',
    link: {
      url: 'https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit#:~:text=What%20exactly%20takes%2066%20days,good%20fit)%20was%2066%20days.',
      text: 'Learn more from this UCL study'
    }
  },
  'Rely on systems, not just initial motivation': {
    body: 'Motivation fluctuates over time, so systems protect you when excitement fades. Having a system means packing your sports bag the previous evening for the morning workout. Not taking your phone to bedroom when going to bed. The purpose of a system is to increase friction for activities we want to avoid or decrease friction for activities we want to encourage.',
    link: {
      url: 'https://jamesclear.com/choice-architecture',
      text: 'Learn more about systems and environment design'
    }
  },
  'Less is more': {
    body: 'Setting fewer, more reachable goals prevents "cognitive overload," allowing you to focus your limited energy on one target rather than spreading it too thin. Achieving these smaller milestones builds "self-efficacy," creating a winning streak that motivates you to take on larger challenges'
  },
  'Choose personal and intrinsic goals': {
    body: 'Ensure the goal is intrinsic, not conformist. Ask yourself why you want this. If the answer is "to impress people," the chances of quitting are much higher, than in case where the answer is personal growth or joy.',
    link: {
      url: 'https://selfdeterminationtheory.org/theory/',
      text: 'Read more about how intrinsic motivation increases your performance'
    }
  },
  'Your identity has to grow with your goals': {
    body: 'See your goals as part of who you are becoming, not separate from who you currently are. Reinforce new behaviors with self-perceptions like "I am a runner" or "I am someone who learns consistently".  When identity and habits align, motivation deepens and behavior change becomes more durable',
    link: {
      url: 'https://jamesclear.com/identity-based-habits',
      text: 'Learn more about identity-based habits'
    }
  },
  'Set realistic expectations & pace yourself': {
    body: 'Unrealistic targets and unsustainable paces lead to burnout and abandonment. Match your goals with a pace that fits your life. Build in rest, buffer for setbacks, and adjust when priorities shift.'
  }
};

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
  const content = TAKEAWAY_CONTENT[normalizedTitle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content with darker purple gradient background */}
      <div 
        className="relative z-10 border-2 border-purple-500/40 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, oklch(0.25 0.08 280) 0%, oklch(0.20 0.10 290) 50%, oklch(0.22 0.08 270) 100%)'
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
        <div className="space-y-4 text-white/90">
          <p>
            {content?.body || 'Content not available.'}
          </p>
          {content?.link && (
            <p className="pt-2">
              <a 
                href={content.link.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 underline"
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
            className="rounded-[100px] bg-transparent border border-white/60 text-white hover:bg-white/10 px-8"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
