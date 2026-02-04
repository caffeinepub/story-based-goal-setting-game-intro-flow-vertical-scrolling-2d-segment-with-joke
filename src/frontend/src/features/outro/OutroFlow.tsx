import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getBackgroundGradient, TOTAL_INTRO_DARKENING_STEPS } from '../intro/introBackground';
import TakeawayModal from './TakeawayModal';
import NameSubmissionModal from './NameSubmissionModal';
import { useAddWallOfFameEntry } from '@/hooks/useQueries';
import { usePersistentPlayerId } from '@/hooks/usePersistentPlayerId';

// Outro text blocks
const OUTRO_BLOCK_1 = [
  'Well, that wasn\'t that hard.',
  'Who would\'ve thought that there are so many ways to sabotage your goals.',
];

const OUTRO_BLOCK_2 = [
  'What can we learn from Barnabus\'s experience?',
  'Setting goals is just not worth it?',
  'That can\'t be it...',
];

const OUTRO_BLOCK_3 = [
  'Setting goals is good, it gives you a sense of destination and direction.',
  'Applications and TODO lists won\'t accomplish your goals for you, the drive must come from within.',
  'And not all goals can and will be reached, but that\'s fine.',
  'If you fail - analyze, tweak, and most importantly, don\'t shame yourself.',
  'Here are 7 takeaways from Barny\'s experience that offer a more realistic way to think about goals and personal change.',
];

const FINAL_MESSAGES = [
  'Thanks for helping Barnabus on this journey.',
  'Sometimes helping others is the best help for yourself.',
  'If you\'d like to take something with you, there\'s something I can offer.',
  'Tell me your name and I\'ll add you to the Wall of Fame and share a certificate of completion with you.',
];

const TAKEAWAYS = [
  'Set clear and specific goals.',
  'Adopt a flexible, progress-focused mindset.',
  'Rely on systems, not just initial motivation.',
  'Less is more.',
  'Choose personal and intrinsic goals.',
  'Your identity has to grow with your goals.',
  'Set realistic expectations & pace yourself.',
];

// Match intro timing
const LINE_REVEAL_DELAY = 1000;

type OutroStage = 
  | 'block-1' 
  | 'block-1-continue' 
  | 'block-2' 
  | 'block-2-continue'
  | 'block-3'
  | 'block-3-continue'
  | 'takeaways'
  | 'takeaways-continue'
  | 'final-messages'
  | 'final-messages-continue'
  | 'name-submission';

interface OutroFlowProps {
  onComplete: () => void;
}

export default function OutroFlow({ onComplete }: OutroFlowProps) {
  const [stage, setStage] = useState<OutroStage>('block-1');
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [selectedTakeaway, setSelectedTakeaway] = useState<string | null>(null);
  const [revealedTakeawaysCount, setRevealedTakeawaysCount] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Gradient lightening state - start at the darkest (final intro gradient)
  const [lighteningIndex, setLighteningIndex] = useState(TOTAL_INTRO_DARKENING_STEPS);
  const [prevGradient, setPrevGradient] = useState('');
  const [nextGradient, setNextGradient] = useState('');
  const [gradientOpacity, setGradientOpacity] = useState(1);
  
  const { setPlayerId } = usePersistentPlayerId();
  const addEntryMutation = useAddWallOfFameEntry();

  // Calculate current gradient based on lightening index
  const currentGradient = getBackgroundGradient(lighteningIndex, TOTAL_INTRO_DARKENING_STEPS);

  // Smooth gradient transition effect (same as IntroFlow)
  useEffect(() => {
    if (prevGradient && prevGradient !== currentGradient) {
      setNextGradient(currentGradient);
      setGradientOpacity(0);
      
      const timer = setTimeout(() => {
        setGradientOpacity(1);
      }, 50);

      const completeTimer = setTimeout(() => {
        setPrevGradient(currentGradient);
        setNextGradient('');
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else if (!prevGradient) {
      setPrevGradient(currentGradient);
    }
  }, [currentGradient, prevGradient]);

  // Block 1 reveal
  useEffect(() => {
    if (stage === 'block-1' && currentLineIndex < OUTRO_BLOCK_1.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, OUTRO_BLOCK_1[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'block-1' && currentLineIndex >= OUTRO_BLOCK_1.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('block-1-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Block 2 reveal
  useEffect(() => {
    if (stage === 'block-2' && currentLineIndex < OUTRO_BLOCK_2.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, OUTRO_BLOCK_2[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'block-2' && currentLineIndex >= OUTRO_BLOCK_2.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('block-2-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Block 3 reveal with lightening
  useEffect(() => {
    if (stage === 'block-3' && currentLineIndex < OUTRO_BLOCK_3.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, OUTRO_BLOCK_3[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
        // Lighten immediately with first line and continue with each line
        setLighteningIndex((prev) => Math.max(prev - 1, 0));
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'block-3' && currentLineIndex >= OUTRO_BLOCK_3.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('block-3-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Takeaways reveal with continued lightening
  useEffect(() => {
    if (stage === 'takeaways' && revealedTakeawaysCount < TAKEAWAYS.length) {
      const timer = setTimeout(() => {
        setRevealedTakeawaysCount((prev) => prev + 1);
        // Continue lightening with each takeaway reveal
        setLighteningIndex((prev) => Math.max(prev - 1, 0));
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'takeaways' && revealedTakeawaysCount >= TAKEAWAYS.length) {
      // Show continue button after all takeaways + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('takeaways-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, revealedTakeawaysCount]);

  // Final messages reveal
  useEffect(() => {
    if (stage === 'final-messages' && currentLineIndex < FINAL_MESSAGES.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, FINAL_MESSAGES[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'final-messages' && currentLineIndex >= FINAL_MESSAGES.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('final-messages-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  const handleContinueBlock1 = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('block-2');
  };

  const handleContinueBlock2 = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('block-3');
  };

  const handleContinueBlock3 = () => {
    setShowContinue(false);
    setRevealedTakeawaysCount(0);
    setStage('takeaways');
  };

  const handleContinueTakeaways = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('final-messages');
  };

  const handleContinueFinalMessages = () => {
    setShowContinue(false);
    setShowNameModal(true);
    setStage('name-submission');
  };

  const handleTakeawayClick = (takeaway: string) => {
    setSelectedTakeaway(takeaway);
  };

  const handleCloseModal = () => {
    setSelectedTakeaway(null);
  };

  const handleNameSubmit = async () => {
    if (!playerName.trim()) return;

    // Clear any previous error
    setSubmissionError(null);

    try {
      const result = await addEntryMutation.mutateAsync({ name: playerName.trim() });
      
      // Store player ID locally after successful submission
      setPlayerId(result.id);
      
      // Close modal and navigate to Hall of Fame
      setShowNameModal(false);
      onComplete();
    } catch (error) {
      console.error('Failed to submit name:', error);
      setSubmissionError('Failed to submit your name. Please try again.');
    }
  };

  const handleSkipToWallOfFame = () => {
    setShowNameModal(false);
    onComplete();
  };

  const handleRetrySubmission = () => {
    setSubmissionError(null);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-6 pb-12 relative overflow-hidden" 
      style={{ 
        paddingTop: 'calc(96px + 25vh)',
      }}
    >
      {/* Background layers for smooth transition (same as IntroFlow) */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ 
          background: prevGradient,
          opacity: 1,
        }}
      />
      {nextGradient && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ 
            background: nextGradient,
            opacity: gradientOpacity,
          }}
        />
      )}

      {/* Content container with stable top-aligned positioning - 15% wider */}
      <div className="max-w-3xl w-full relative z-10 flex flex-col items-center">
        {/* Text container with top alignment to prevent shifting */}
        {(stage !== 'takeaways' && stage !== 'takeaways-continue' && stage !== 'name-submission') && (
          <div className="w-full space-y-8">
            {displayedText.map((text, index) => (
              <p
                key={index}
                className="text-center whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-500 text-xl md:text-2xl text-white"
              >
                {text}
              </p>
            ))}
          </div>
        )}

        {/* Takeaways list with line-by-line reveal */}
        {(stage === 'takeaways' || stage === 'takeaways-continue') && (
          <div className="w-full space-y-6">
            <div className="space-y-4 flex flex-col items-center">
              {TAKEAWAYS.slice(0, revealedTakeawaysCount).map((takeaway, index) => (
                <button
                  key={index}
                  onClick={() => handleTakeawayClick(takeaway)}
                  className="text-xl md:text-2xl text-white underline cursor-pointer hover:text-purple-300 transition-colors text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  {takeaway}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue buttons */}
        {stage === 'block-1-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinueBlock1}
              size="lg"
              className="rounded-[100px] bg-transparent border border-white/60 text-white hover:bg-white/10 px-8"
            >
              Continue
            </Button>
          </div>
        )}

        {stage === 'block-2-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinueBlock2}
              size="lg"
              className="rounded-[100px] bg-transparent border border-white/60 text-white hover:bg-white/10 px-8"
            >
              Continue
            </Button>
          </div>
        )}

        {stage === 'block-3-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinueBlock3}
              size="lg"
              className="rounded-[100px] bg-transparent border border-white/60 text-white hover:bg-white/10 px-8"
            >
              Continue
            </Button>
          </div>
        )}

        {stage === 'takeaways-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinueTakeaways}
              size="lg"
              className="rounded-[100px] bg-transparent border border-white/60 text-white hover:bg-white/10 px-8"
            >
              Continue
            </Button>
          </div>
        )}

        {stage === 'final-messages-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinueFinalMessages}
              size="lg"
              className="rounded-[100px] bg-transparent border border-white/60 text-white hover:bg-white/10 px-8"
            >
              Continue
            </Button>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-12 text-center text-white/50 text-sm relative z-10">
        © 2026. Built with love using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-purple-200 underline"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Takeaway modal */}
      {selectedTakeaway && (
        <TakeawayModal
          title={selectedTakeaway}
          onClose={handleCloseModal}
        />
      )}

      {/* Name submission modal */}
      {showNameModal && (
        <NameSubmissionModal
          open={showNameModal}
          name={playerName}
          onNameChange={setPlayerName}
          onSubmit={handleNameSubmit}
          onClose={() => setShowNameModal(false)}
          onSkip={handleSkipToWallOfFame}
          isLoading={addEntryMutation.isPending}
          error={submissionError}
          onRetry={handleRetrySubmission}
        />
      )}
    </div>
  );
}
