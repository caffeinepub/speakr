import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AudioPost } from '@/backend';

const QUERY_TIMEOUT = 30000; // 30 seconds

export function useAudioReplies(postId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AudioPost[]>({
    queryKey: ['audioReplies', postId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 30 seconds. Please check your connection.')), QUERY_TIMEOUT);
      });
      
      const myContent = await Promise.race([
        actor.getMyContent(),
        timeoutPromise
      ]);
      
      return myContent.filter(post => post.replyTo === postId);
    },
    enabled: !!actor && !actorFetching && !!postId,
    retry: 2,
    retryDelay: 1000,
  });
}
