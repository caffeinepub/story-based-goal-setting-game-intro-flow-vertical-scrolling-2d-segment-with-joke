interface SpeechBalloonProps {
  text: string;
  x: number;
  y: number;
  canvasWidth: number;
}

export default function SpeechBalloon({ text, x, y, canvasWidth }: SpeechBalloonProps) {
  // Calculate position to keep balloon within canvas bounds
  const balloonWidth = 200;
  const leftOffset = Math.max(10, Math.min(x - balloonWidth / 2, canvasWidth - balloonWidth - 10));

  return (
    <div
      className="absolute pointer-events-none animate-in fade-in zoom-in duration-300"
      style={{
        left: `${leftOffset}px`,
        top: `${y}px`,
      }}
    >
      <div className="relative bg-amber-50 text-stone-900 px-4 py-3 rounded-2xl shadow-lg max-w-[200px] border-2 border-amber-600">
        <p className="text-sm font-medium leading-tight">{text}</p>
        {/* Speech balloon tail */}
        <div
          className="absolute w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-600"
          style={{
            left: `${x - leftOffset - 12}px`,
            bottom: '-16px',
          }}
        />
        <div
          className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-amber-50"
          style={{
            left: `${x - leftOffset - 10}px`,
            bottom: '-13px',
          }}
        />
      </div>
    </div>
  );
}
