import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getFinalIntroGradient } from '../intro/introBackground';

// Outro text blocks
const OUTRO_BLOCK_1 = [
  'Well, that wasn\'t that hard',
  'Who would\'ve thought that avoiding your goals is that simple',
];

const OUTRO_BLOCK_2 = [
  'What can we learn from Barnabus\'s experience?',
  'Setting goals is just not worth it?',
];

// Match intro timing
const LINE_REVEAL_DELAY = 1000;

type OutroStage = 'block-1' | 'block-1-continue' | 'block-2' | 'block-2-complete';

export default function OutroFlow() {
  const [stage, setStage] = useState<OutroStage>('block-1');
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

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
      // Mark as complete after last line
      const timer = setTimeout(() => {
        setStage('block-2-complete');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  const handleContinue = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('block-2');
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

        {/* Continue button */}
        {stage === 'block-1-continue' && showContinue && (
          <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleContinue}
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
    </div>
  );
}
