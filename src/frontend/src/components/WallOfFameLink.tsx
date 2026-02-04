import { Button } from '@/components/ui/button';

interface WallOfFameLinkProps {
  onClick: () => void;
}

export default function WallOfFameLink({ onClick }: WallOfFameLinkProps) {
  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        onClick={onClick}
        variant="ghost"
        className="text-white/60 hover:text-white/90 hover:bg-white/10 text-sm underline"
      >
        Wall of Fame
      </Button>
    </div>
  );
}
