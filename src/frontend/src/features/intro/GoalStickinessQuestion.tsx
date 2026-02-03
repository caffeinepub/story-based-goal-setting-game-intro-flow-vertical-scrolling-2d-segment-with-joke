import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
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
        "That's a good guess, but not exactly right. Don't worry, it's a tricky question and we're all just learning. No mistake is irreversible."
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

  return (
    <div className="space-y-6 pt-8">
      {!submitted ? (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">1%</span>
              <span className="text-2xl font-bold text-amber-200">{value[0]}%</span>
              <span className="text-sm text-foreground/70">100%</span>
            </div>
            <Slider
              value={value}
              onValueChange={setValue}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
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
