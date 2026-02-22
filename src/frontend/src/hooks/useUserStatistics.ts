import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserStatistics } from '@/backend';

const QUERY_TIMEOUT = 30000; // 30 seconds

export function useUserStatistics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserStatistics>({
    queryKey: ['userStatistics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 30 seconds. Please check your connection.')), QUERY_TIMEOUT);
      });
      
      return Promise.race([
        actor.getUserStatistics(),
        timeoutPromise
      ]);
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: 1000,
  });
}
