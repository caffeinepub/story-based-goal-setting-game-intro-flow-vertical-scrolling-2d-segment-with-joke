import { Button } from '@/components/ui/button';
import { getFinalIntroGradient } from '../intro/introBackground';
import { useWallOfFame } from '@/hooks/useQueries';
import { usePersistentPlayerId } from '@/hooks/usePersistentPlayerId';
import { generateCertificatePdf } from './certificatePdf';
import { Download, Loader2 } from 'lucide-react';

export default function HallOfFameView() {
  const { data: entries = [], isLoading } = useWallOfFame();
  const { playerId } = usePersistentPlayerId();

  // Find the player's entry
  const playerEntry = entries.find((entry) => entry.id === playerId);

  const handleDownloadCertificate = () => {
    if (playerEntry) {
      generateCertificatePdf(playerEntry.name);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 pb-12 relative overflow-hidden"
      style={{
        paddingTop: 'calc(96px + 15vh)',
        background: getFinalIntroGradient(),
      }}
    >
      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
          Wall of Fame
        </h1>
        <p className="text-xl text-center text-white/80 mb-12">
          Eternal respect to the heroes who have helped Barnabus, The Undeterred.
        </p>

        {playerEntry && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleDownloadCertificate}
              size="lg"
              className="rounded-[100px] bg-purple-600 hover:bg-purple-700 text-white px-8 gap-2"
            >
              <Download className="w-5 h-5" />
              Download Your Certificate
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          </div>
        ) : (
          <div 
            className="w-full border border-purple-500/40 rounded-lg p-8 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, oklch(0.20 0.08 280) 0%, oklch(0.18 0.10 290) 50%, oklch(0.19 0.08 270) 100%)'
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.id}-${index}`}
                  className={`p-4 rounded-lg border transition-all ${
                    entry.id === playerId
                      ? 'border-purple-400 text-white'
                      : 'border-purple-500/30 text-white/80'
                  }`}
                  style={{
                    background: entry.id === playerId
                      ? 'linear-gradient(135deg, oklch(0.30 0.12 280) 0%, oklch(0.28 0.14 290) 100%)'
                      : 'linear-gradient(135deg, oklch(0.25 0.08 280) 0%, oklch(0.23 0.10 290) 100%)'
                  }}
                >
                  <p className="text-center font-medium">{entry.name}</p>
                </div>
              ))}
            </div>
            {entries.length === 0 && (
              <p className="text-center text-white/60 py-8">
                No entries yet. Be the first to complete the journey!
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="mt-auto pt-12 text-center text-white/50 text-sm">
        © 2026. Built with love using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-purple-200 underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
