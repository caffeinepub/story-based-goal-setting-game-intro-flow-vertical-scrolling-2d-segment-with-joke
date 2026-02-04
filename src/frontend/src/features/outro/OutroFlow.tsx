import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getFinalIntroGradient } from '../intro/introBackground';
import TakeawayModal from './TakeawayModal';

// Outro text blocks
const OUTRO_BLOCK_1 = [
  'Well, that wasn\'t that hard',
  'Who would\'ve thought that avoiding your goals is that simple',
];

const OUTRO_BLOCK_2 = [
  'What can we learn from Barnabus\'s experience?',
  'Setting goals is just not worth it?',
  'That can\'t be it...',
];

const OUTRO_BLOCK_3 = [
  'Setting goals is good, it gives you a sense destination and direction.',
  'Applications and TODO lists won\'t accomplish your goals for you, the drive must come from within.',
  'And not all goals can and will be reached, but that\'s fine.',
  'If you fail - analyze, tweak, and most importantly, don\'t shame yourself.',
  'Here are 7 takeaways from Barny\'s experience to help you and Barny craft goals that are more realistic and can truly change you for the better without doing harm',
];

const TAKEAWAYS = [
  'Vague goals, wishes',
  'All-or-Nothing mentality',
  'Kick-off excitement (especially if share with others)',
  'Lack of Environmental Design',
  'The conformity of the goal',
  'Identity shift',
  'Sustainable pace, realistic expectations',
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
  | 'takeaways';

export default function OutroFlow() {
  const [stage, setStage] = useState<OutroStage>('block-1');
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [selectedTakeaway, setSelectedTakeaway] = useState<string | null>(null);

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

  // Block 3 reveal
  useEffect(() => {
    if (stage === 'block-3' && currentLineIndex < OUTRO_BLOCK_3.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, OUTRO_BLOCK_3[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
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
    setStage('takeaways');
  };

  const handleTakeawayClick = (takeaway: string) => {
    setSelectedTakeaway(takeaway);
  };

  const handleCloseModal = () => {
    setSelectedTakeaway(null);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-6 pb-12 relative overflow-hidden" 
      style={{ 
        paddingTop: 'calc(96px + 25vh)',
        background: getFinalIntroGradient(),
      }}
    >
      {/* Content container with stable top-aligned positioning */}
      <div className="max-w-2xl w-full relative z-10 flex flex-col items-center">
        {/* Text container with top alignment to prevent shifting */}
        {stage !== 'takeaways' && (
          <div className="w-full space-y-8">
            {displayedText.map((text, index) => (
              <p
                key={index}
                className="text-center whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-500 text-xl md:text-2xl text-foreground/90"
              >
                {text}
              </p>
            ))}
          </div>
        )}

        {/* Takeaways list */}
        {stage === 'takeaways' && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ul className="space-y-4">
              {TAKEAWAYS.map((takeaway, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleTakeawayClick(takeaway)}
                    className="text-xl md:text-2xl text-foreground/90 underline cursor-pointer hover:text-foreground transition-colors text-left w-full"
                  >
                    - {takeaway}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Continue buttons */}
        {stage === 'block-1-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinueBlock1}
              size="lg"
              className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
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
              className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
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
              className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
            >
              Continue
            </Button>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-12 text-center text-stone-500 text-sm">
        © 2026. Built with love using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-500 underline"
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
    </div>
  );
}
