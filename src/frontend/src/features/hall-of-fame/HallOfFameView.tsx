import { Button } from '@/components/ui/button';
import { getInitialIntroGradient } from '../intro/introBackground';
import { useWallOfFame } from '@/hooks/useQueries';
import { usePersistentPlayerId } from '@/hooks/usePersistentPlayerId';
import { generateCertificatePdf } from './certificatePdf';
import { Download, Loader2, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * DEVELOPER NOTE: Wall of Fame Persistence Verification
 * 
 * To verify entries persist across backend upgrades/redeploys:
 * 1. Submit a name → confirm it appears in the Wall of Fame
 * 2. Run: `dfx deploy backend --mode upgrade`
 * 3. Reload the page to re-query the backend
 * 4. Confirm the same entry still appears
 * 
 * The error state includes a Retry button that manually triggers refetch()
 * to re-query the backend without requiring a full page reload.
 */

interface HallOfFameViewProps {
  onBackToStart?: () => void;
}

/**
 * Checks if an error message indicates the backend canister is stopped.
 */
function isCanisterStoppedError(error: unknown): boolean {
  if (!error) return false;
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    errorMessage.includes('IC0508') ||
    errorMessage.includes('Reject code: 5') ||
    errorMessage.includes('canister is stopped') ||
    errorMessage.includes('Canister') && errorMessage.includes('is stopped')
  );
}

export default function HallOfFameView({ onBackToStart }: HallOfFameViewProps) {
  const { data: entries = [], isLoading, refetch, isFetching, isError, error, isActorInitializing } = useWallOfFame();
  const { playerId, hasCompleted } = usePersistentPlayerId();

  // Find the player's entry only if they have completed
  const playerEntry = hasCompleted && playerId ? entries.find((entry) => entry.id === playerId) : null;

  const handleDownloadCertificate = async () => {
    if (playerEntry) {
      await generateCertificatePdf(playerEntry.name);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Show loading state while actor is initializing or data is being fetched for the first time
  const showLoading = isActorInitializing || (isLoading && !isError);

  // Determine friendly error message
  const canisterStopped = isError && isCanisterStoppedError(error);
  const errorMessage = canisterStopped
    ? 'The backend service is currently stopped or unavailable. Please try again later.'
    : error instanceof Error
    ? error.message
    : 'An error occurred while fetching entries. Please try again.';

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

        {/* Action buttons row - only show certificate button if player has completed */}
        {hasCompleted && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleDownloadCertificate}
              size="lg"
              disabled={!playerEntry}
              className="rounded-[100px] bg-purple-600 hover:bg-purple-700 text-white px-8 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Download Your Certificate
            </Button>
          </div>
        )}

        {/* Loading state */}
        {showLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          </div>
        )}

        {/* Error state */}
        {isError && !showLoading && (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {canisterStopped ? 'Service Unavailable' : 'Failed to Load Wall of Fame'}
              </h3>
              <p className="text-white/70 mb-6">
                {errorMessage}
              </p>
              <Button
                onClick={handleRefresh}
                size="lg"
                disabled={isFetching}
                className="rounded-[100px] bg-purple-600 hover:bg-purple-700 text-white px-8 gap-2"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Success state - show entries or empty message */}
        {!showLoading && !isError && (
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
