import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { storySteps, postSliderSteps } from '@/content/story';
import GoalStickinessQuestion from './GoalStickinessQuestion';
import { getBackgroundGradient } from './introBackground';

interface IntroFlowProps {
  onComplete: () => void;
}

export default function IntroFlow({ onComplete }: IntroFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [postSliderStep, setPostSliderStep] = useState(0);
  const [displayedText, setDisplayedText] = useState<string[]>([]);

  const step = storySteps[currentStep];
  const darkeningSteps = storySteps.filter((s) => s.darkening).length;
  const currentDarkeningIndex = storySteps
    .slice(0, currentStep + 1)
    .filter((s) => s.darkening).length;

  const backgroundGradient = getBackgroundGradient(currentDarkeningIndex, darkeningSteps);

  useEffect(() => {
    if (!step) return;

    if (step.type === 'text') {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, step.text]);
        setCurrentStep((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (step.type === 'button') {
      setShowButton(true);
    } else if (step.type === 'slider') {
      setDisplayedText((prev) => [...prev, step.text]);
      setShowSlider(true);
    }
  }, [currentStep, step]);

  useEffect(() => {
    if (sliderSubmitted && postSliderStep < postSliderSteps.length) {
      const timer = setTimeout(() => {
        const postStep = postSliderSteps[postSliderStep];
        setDisplayedText((prev) => [...prev, postStep.text]);
        setPostSliderStep((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (sliderSubmitted && postSliderStep >= postSliderSteps.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sliderSubmitted, postSliderStep, onComplete]);

  const handleStartClick = () => {
    setShowButton(false);
    setCurrentStep((prev) => prev + 1);
  };

  const handleSliderSubmit = () => {
    setShowSlider(false);
    setSliderSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-all duration-1000"
      style={{ background: backgroundGradient }}
    >
      <div className="max-w-2xl w-full space-y-8">
        {displayedText.map((text, index) => {
          const isEmphasized = sliderSubmitted && index === displayedText.length - postSliderSteps.length;
          return (
            <p
              key={index}
              className={`text-center whitespace-pre-line transition-opacity duration-700 ${
                isEmphasized
                  ? 'text-3xl font-bold text-amber-100'
                  : 'text-xl md:text-2xl text-foreground/90'
              }`}
              style={{ opacity: 1 }}
            >
              {text}
            </p>
          );
        })}

        {showButton && (
          <div className="flex justify-center pt-8 animate-bounce">
            <Button
              onClick={handleStartClick}
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
            >
              {step.buttonText}
            </Button>
          </div>
        )}

        {showSlider && <GoalStickinessQuestion onSubmit={handleSliderSubmit} />}
      </div>
    </div>
  );
}
