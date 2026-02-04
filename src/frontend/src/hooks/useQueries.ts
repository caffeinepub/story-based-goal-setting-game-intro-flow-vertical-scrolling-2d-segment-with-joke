import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WallOfFameEntry } from '../backend';

export function useWallOfFame() {
  const { actor } = useActor();

  return useQuery<WallOfFameEntry[]>({
    queryKey: ['wall-of-fame'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor,
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
