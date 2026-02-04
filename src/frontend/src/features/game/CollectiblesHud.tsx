import { Star } from 'lucide-react';

interface CollectiblesHudProps {
  collectedCount: number;
  totalCount: number;
}

export default function CollectiblesHud({ collectedCount, totalCount }: CollectiblesHudProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-stone-900/90 rounded-full px-6 py-2 flex items-center gap-3 shadow-lg">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <span className="text-amber-400 font-bold text-lg">
          {collectedCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
