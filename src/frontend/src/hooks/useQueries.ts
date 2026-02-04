import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WallOfFameEntry } from '../backend';

/**
 * DEVELOPER NOTE: Wall of Fame Persistence Verification Procedure
 * 
 * This hook manages Wall of Fame data fetching with automatic refetch on mount.
 * To verify that entries persist across backend upgrades/redeploys:
 * 
 * 1. Submit at least one name to the Wall of Fame (complete the game or use the form)
 * 2. Confirm the entry appears in the Wall of Fame view
 * 3. Perform a backend upgrade/redeploy: `dfx deploy backend --mode upgrade`
 * 4. Refresh the Wall of Fame view (use the Refresh button or reload the page)
 * 5. Verify the same entry still appears in the list
 * 
 * Expected behavior:
 * - getAllEntries() should return the same entries before and after upgrade
 * - List order remains consistent (insertion order, latest entries last)
 * - No entries are lost during the upgrade process
 */
export function useWallOfFame() {
  const { actor, isFetching } = useActor();

  return useQuery<WallOfFameEntry[]>({
    queryKey: ['wall-of-fame'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnMount: 'always', // Refetch when component mounts
  });
}

export function useAddWallOfFameEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Generate ID
      const id = await actor.generateId();
      
      // Add entry to Wall of Fame
      await actor.addEntry(id, name);
      
      return { id, name };
    },
    onSuccess: (data) => {
      // Optimistically update the cache with the new entry
      queryClient.setQueryData<WallOfFameEntry[]>(['wall-of-fame'], (old = []) => [
        ...old,
        { id: data.id, name: data.name },
      ]);
      
      // Also invalidate to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['wall-of-fame'] });
    },
  });
}
