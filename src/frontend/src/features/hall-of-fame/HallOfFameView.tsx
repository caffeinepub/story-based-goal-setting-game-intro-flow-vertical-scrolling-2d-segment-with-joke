import { Button } from '@/components/ui/button';
import { getInitialIntroGradient } from '../intro/introBackground';
import { useWallOfFame } from '@/hooks/useQueries';
import { usePersistentPlayerId } from '@/hooks/usePersistentPlayerId';
import { generateCertificatePdf } from './certificatePdf';
import { Download, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * DEVELOPER NOTE: Wall of Fame Persistence Verification
 * 
 * To verify entries persist across backend upgrades/redeploys:
 * 1. Submit a name → confirm it appears in the Wall of Fame
 * 2. Run: `dfx deploy backend --mode upgrade`
 * 3. Click the "Refresh" button below or reload the page
 * 4. Confirm the same entry still appears
 * 
 * The Refresh button manually triggers refetch() to re-query the backend
 * without requiring a full page reload, making verification quick and easy.
 */

interface HallOfFameViewProps {
  onBackToStart?: () => void;
}

export default function HallOfFameView({ onBackToStart }: HallOfFameViewProps) {
  const { data: entries = [], isLoading, refetch, isFetching } = useWallOfFame();
  const { playerId, hasCompleted } = usePersistentPlayerId();

  // Find the player's entry only if they have completed
  const playerEntry = hasCompleted && playerId ? entries.find((entry) => entry.id === playerId) : null;

  // For testing: always show download button and use last entry
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  const handleDownloadCertificate = async () => {
    if (lastEntry) {
      await generateCertificatePdf(lastEntry.name);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 pb-12 relative overflow-hidden"
      style={{
        paddingTop: 'calc(96px + 15vh)',
        background: getInitialIntroGradient(),
      }}
    >
      {/* Fixed top-left Back to start button */}
      {onBackToStart && (
        <div className="fixed top-6 left-6 z-50">
          <Button
            onClick={onBackToStart}
            variant="ghost"
            className="text-white/60 hover:text-white/90 hover:bg-white/10 text-sm underline gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to start
          </Button>
        </div>
      )}

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
          Wall of Fame
        </h1>
        <p className="text-xl text-center text-white/80 mb-12">
          Eternal respect to the heroes who have helped Barnabus, The Undeterred.
        </p>

        {/* Action buttons row */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            onClick={handleDownloadCertificate}
            size="lg"
            disabled={!lastEntry}
            className="rounded-[100px] bg-purple-600 hover:bg-purple-700 text-white px-8 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Download Your Certificate
          </Button>
          
          <Button
            onClick={handleRefresh}
            size="lg"
            disabled={isFetching}
            variant="outline"
            className="rounded-[100px] bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.id}-${index}`}
                  className={`text-center transition-all ${
                    playerEntry && entry.id === playerId
                      ? 'text-white font-bold'
                      : 'text-white/80'
                  }`}
                >
                  <span className="text-lg">{index + 1}. {entry.name}</span>
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
