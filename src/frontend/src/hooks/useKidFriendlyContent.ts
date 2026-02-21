import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AudioPost } from '@/backend';

export function useKidFriendlyContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AudioPost[]>({
    queryKey: ['kidFriendlyPosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getKidFriendlyPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}
