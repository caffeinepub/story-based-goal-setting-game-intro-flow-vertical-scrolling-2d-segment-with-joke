import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface GoalStickinessQuestionProps {
  onSubmit: () => void;
}

export default function GoalStickinessQuestion({ onSubmit }: GoalStickinessQuestionProps) {
  const [value, setValue] = useState([50]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

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
    setTimeout(() => {
      onSubmit();
    }, 3000);
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
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8"
            >
              Submit
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-lg text-foreground/90 animate-in fade-in duration-700">
          {feedback}
        </p>
      )}
    </div>
  );
}
