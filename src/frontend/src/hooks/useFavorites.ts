import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { AudioPost } from '@/backend';

const QUERY_TIMEOUT = 30000; // 30 seconds

export function useFavorites() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<AudioPost[]>({
    queryKey: ['favoritePosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 30 seconds. Please check your connection.')), QUERY_TIMEOUT);
      });
      
      return Promise.race([
        actor.getFavoritePosts(),
        timeoutPromise
      ]);
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: 2,
    retryDelay: 1000,
  });
}
