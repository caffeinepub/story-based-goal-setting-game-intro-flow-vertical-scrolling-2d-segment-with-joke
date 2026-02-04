import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GoalStickinessQuestionProps {
  onSubmit: () => void;
}

// Match the intro flow timing - 50% of previous 2000ms
const FEEDBACK_DELAY = 1000;

export default function GoalStickinessQuestion({ onSubmit }: GoalStickinessQuestionProps) {
  const [value, setValue] = useState([50]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showContinue, setShowContinue] = useState(false);

  const handleSubmit = () => {
    const selectedValue = value[0];
    if (selectedValue >= 5 && selectedValue <= 10) {
      setFeedback("That's correct, I see you have some experience with setting goals.");
    } else {
      setFeedback(
        "That's a good guess, but not exactly right. Don't worry, it's a tricky question and we're all just learning."
      );
    }
    setSubmitted(true);
    
    // Show Continue button after feedback delay
    setTimeout(() => {
      setShowContinue(true);
    }, FEEDBACK_DELAY);
  };

  const handleContinue = () => {
    onSubmit();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue([parseInt(e.target.value, 10)]);
  };

  return (
    <div className="space-y-6 pt-8">
      {!submitted ? (
        <>
          <div className="flex justify-center">
            <div className="w-1/2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">1%</span>
                <span className="text-sm text-foreground/70">100%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={value[0]}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, oklch(0.35 0.12 280) 0%, oklch(0.35 0.12 280) ${value[0]}%, oklch(0.35 0.12 280 / 0.3) ${value[0]}%, oklch(0.35 0.12 280 / 0.3) 100%)`
                  }}
                />
                <style>{`
                  .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: oklch(0.45 0.15 280);
                    cursor: pointer;
                    border: 2px solid oklch(0.55 0.18 280);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                  }
                  .slider-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: oklch(0.45 0.15 280);
                    cursor: pointer;
                    border: 2px solid oklch(0.55 0.18 280);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                  }
                `}</style>
              </div>
              <div className="flex justify-center">
                <span className="text-sm text-white font-medium">{value[0]}%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
            >
              Submit
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-lg text-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {feedback}
          </p>
          {showContinue && (
            <div className="flex justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleContinue}
                size="lg"
                className="rounded-[100px] bg-transparent border border-current text-foreground/90 hover:bg-foreground/5 px-8"
              >
                Continue
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
