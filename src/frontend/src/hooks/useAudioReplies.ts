import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AudioPost } from '@/backend';

export function useAudioReplies(postId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AudioPost[]>({
    queryKey: ['audioReplies', postId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Get all user content and filter for replies to this post
      const myContent = await actor.getMyContent();
      return myContent.filter(post => post.replyTo === postId);
    },
    enabled: !!actor && !actorFetching && !!postId,
    retry: false,
  });
}
