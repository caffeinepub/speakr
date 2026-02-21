import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { AudioPost } from '@/backend';

export function useFavorites() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<AudioPost[]>({
    queryKey: ['favoritePosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFavoritePosts();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}
