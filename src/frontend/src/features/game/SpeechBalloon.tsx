interface SpeechBalloonProps {
  text: string;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight?: number;
}

export default function SpeechBalloon({ text, x, y, canvasWidth, canvasHeight = 660 }: SpeechBalloonProps) {
  // Calculate balloon dimensions
  const balloonWidth = 200;
  const balloonHeight = 80; // Approximate height
  
  // Clamp balloon position to stay fully within canvas bounds
  const leftOffset = Math.max(10, Math.min(x - balloonWidth / 2, canvasWidth - balloonWidth - 10));
  const topOffset = Math.max(10, Math.min(y, canvasHeight - balloonHeight - 10));

  // Calculate tail position: clamp within balloon body to point toward character as closely as possible
  const tailX = Math.max(12, Math.min(x - leftOffset, balloonWidth - 12));

  return (
    <div
      className="absolute pointer-events-none animate-in fade-in zoom-in duration-300"
      style={{
        left: `${leftOffset}px`,
        top: `${topOffset}px`,
      }}
    >
      <div className="relative bg-amber-50 text-stone-900 px-4 py-3 rounded-2xl shadow-lg max-w-[200px] border-2 border-amber-600">
        <p className="text-sm font-medium leading-tight">{text}</p>
        {/* Speech balloon tail - clamped within balloon body */}
        <div
          className="absolute w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-600"
          style={{
            left: `${tailX - 12}px`,
            bottom: '-16px',
          }}
        />
        <div
          className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-amber-50"
          style={{
            left: `${tailX - 10}px`,
            bottom: '-13px',
          }}
        />
      </div>
    </div>
  );
}
