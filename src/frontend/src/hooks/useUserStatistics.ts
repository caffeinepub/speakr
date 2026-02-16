import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserStatistics } from '@/backend';

export function useUserStatistics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserStatistics>({
    queryKey: ['userStatistics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserStatistics();
    },
    enabled: !!actor && !actorFetching,
  });
}
