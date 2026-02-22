import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AudioPost } from '@/backend';

const QUERY_TIMEOUT = 30000; // 30 seconds

export function useKidFriendlyContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AudioPost[]>({
    queryKey: ['kidFriendlyPosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 30 seconds. Please check your connection.')), QUERY_TIMEOUT);
      });
      
      return Promise.race([
        actor.getKidFriendlyPosts(),
        timeoutPromise
      ]);
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: 1000,
  });
}
