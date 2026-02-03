import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  openingLine,
  openingLines,
  startButton,
  goalsBlockA,
  goalsBlockB,
  sliderQuestion,
  statStep,
  donaldBlockA,
  donaldBlockB,
} from '@/content/story';
import GoalStickinessQuestion from './GoalStickinessQuestion';
import { getBackgroundGradient } from './introBackground';

interface IntroFlowProps {
  onComplete: () => void;
}

type FlowStage =
  | 'opening'
  | 'opening-continue'
  | 'opening-lines'
  | 'opening-lines-start'
  | 'goals-a'
  | 'goals-a-continue'
  | 'goals-b'
  | 'goals-b-continue'
  | 'slider'
  | 'stat'
  | 'stat-continue'
  | 'donald-block-a'
  | 'donald-block-a-continue'
  | 'donald-block-b'
  | 'donald-block-b-continue'
  | 'complete';

// Shared timing constant - 50% of previous 2000ms
const LINE_REVEAL_DELAY = 1000;

export default function IntroFlow({ onComplete }: IntroFlowProps) {
  const [stage, setStage] = useState<FlowStage>('opening');
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [darkeningIndex, setDarkeningIndex] = useState(0);
  const [prevGradient, setPrevGradient] = useState('');
  const [nextGradient, setNextGradient] = useState('');
  const [gradientOpacity, setGradientOpacity] = useState(1);
  const [showContinue, setShowContinue] = useState(false);

  const totalDarkeningSteps = [...goalsBlockA, ...goalsBlockB, sliderQuestion].filter(
    (s) => s.darkening
  ).length;

  const currentGradient = getBackgroundGradient(darkeningIndex, totalDarkeningSteps);

  // Smooth gradient transition effect
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

  // Opening line reveal
  useEffect(() => {
    if (stage === 'opening') {
      const timer = setTimeout(() => {
        setDisplayedText([openingLine.text]);
        const continueTimer = setTimeout(() => {
          setShowContinue(true);
          setStage('opening-continue');
        }, LINE_REVEAL_DELAY);
        return () => clearTimeout(continueTimer);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Opening lines reveal (after first continue) - now shows Start button instead of Continue
  useEffect(() => {
    if (stage === 'opening-lines' && currentLineIndex < openingLines.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, openingLines[currentLineIndex].text]);
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'opening-lines' && currentLineIndex >= openingLines.length) {
      // Show Start button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('opening-lines-start');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Goals Block A reveal
  useEffect(() => {
    if (stage === 'goals-a' && currentLineIndex < goalsBlockA.length) {
      const timer = setTimeout(() => {
        const step = goalsBlockA[currentLineIndex];
        setDisplayedText((prev) => [...prev, step.text]);
        if (step.darkening) {
          setDarkeningIndex((prev) => prev + 1);
        }
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'goals-a' && currentLineIndex >= goalsBlockA.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('goals-a-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Goals Block B reveal
  useEffect(() => {
    if (stage === 'goals-b' && currentLineIndex < goalsBlockB.length) {
      const timer = setTimeout(() => {
        const step = goalsBlockB[currentLineIndex];
        setDisplayedText((prev) => [...prev, step.text]);
        if (step.darkening) {
          setDarkeningIndex((prev) => prev + 1);
        }
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'goals-b' && currentLineIndex >= goalsBlockB.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('goals-b-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Stat stage - show text then continue button
  useEffect(() => {
    if (stage === 'stat') {
      setDisplayedText([statStep.text]);
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('stat-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Donald Block A reveal
  useEffect(() => {
    if (stage === 'donald-block-a' && currentLineIndex < donaldBlockA.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, donaldBlockA[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'donald-block-a' && currentLineIndex >= donaldBlockA.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('donald-block-a-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Donald Block B reveal
  useEffect(() => {
    if (stage === 'donald-block-b' && currentLineIndex < donaldBlockB.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, donaldBlockB[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    } else if (stage === 'donald-block-b' && currentLineIndex >= donaldBlockB.length) {
      // Show continue button after last line + one delay
      const timer = setTimeout(() => {
        setShowContinue(true);
        setStage('donald-block-b-continue');
      }, LINE_REVEAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [stage, currentLineIndex]);

  // Complete flow
  useEffect(() => {
    if (stage === 'complete') {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  const handleOpeningContinue = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('opening-lines');
  };

  const handleStartClick = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('goals-a');
  };

  const handleGoalsAContinue = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('goals-b');
  };

  const handleGoalsBContinue = () => {
    setDisplayedText([sliderQuestion.text]);
    setShowContinue(false);
    if (sliderQuestion.darkening) {
      setDarkeningIndex((prev) => prev + 1);
    }
    setStage('slider');
  };

  const handleSliderSubmit = () => {
    setDisplayedText([]);
    setShowContinue(false);
    setStage('stat');
  };

  const handleStatContinue = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('donald-block-a');
  };

  const handleDonaldBlockAContinue = () => {
    setDisplayedText([]);
    setCurrentLineIndex(0);
    setShowContinue(false);
    setStage('donald-block-b');
  };

  const handleDonaldBlockBContinue = () => {
    setDisplayedText([]);
    setShowContinue(false);
    setStage('complete');
  };

  // Only show Donald image during donald-block-a stages
  const showDonaldImage = stage === 'donald-block-a' || stage === 'donald-block-a-continue';

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pb-12 relative overflow-hidden" style={{ paddingTop: 'calc(96px + 25vh)' }}>
      {/* Background layers for smooth transition */}
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

      {/* Content container with stable top-aligned positioning */}
      <div className="max-w-2xl w-full relative z-10 flex flex-col items-center">
        {/* Donald image - only visible during donald-block-a stages */}
        {showDonaldImage && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <img
              src="/assets/generated/donald-pixel.dim_64x64.png"
              alt="Donald"
              className="w-32 h-32 pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        )}

        {/* Text container with top alignment to prevent shifting */}
        <div className="w-full space-y-8">
          {displayedText.map((text, index) => {
            const isEmphasized = stage === 'stat' || stage === 'stat-continue';
            return (
              <p
                key={index}
                className={`text-center whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                  isEmphasized
                    ? 'text-3xl font-bold text-amber-100'
                    : 'text-xl md:text-2xl text-foreground/90'
                }`}
              >
                {text}
              </p>
            );
          })}
        </div>

        {/* Buttons container */}
        <div className="w-full">
          {stage === 'opening-continue' && showContinue && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleOpeningContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
              >
                Continue
              </Button>
            </div>
          )}

          {stage === 'opening-lines-start' && showContinue && (
            <div className="flex justify-center pt-8 animate-bounce">
              <Button
                onClick={handleStartClick}
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
              >
                {startButton.buttonText}
              </Button>
            </div>
          )}

          {stage === 'goals-a-continue' && showContinue && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleGoalsAContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
              >
                Continue
              </Button>
            </div>
          )}

          {stage === 'goals-b-continue' && showContinue && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleGoalsBContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
              >
                Continue
              </Button>
            </div>
          )}

          {stage === 'slider' && <GoalStickinessQuestion onSubmit={handleSliderSubmit} />}

          {stage === 'stat-continue' && showContinue && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleStatContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-amber-100 hover:bg-amber-100/10 px-8"
              >
                Continue
              </Button>
            </div>
          )}

          {stage === 'donald-block-a-continue' && showContinue && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleDonaldBlockAContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
              >
                Continue
              </Button>
            </div>
          )}

          {stage === 'donald-block-b-continue' && showContinue && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleDonaldBlockBContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
