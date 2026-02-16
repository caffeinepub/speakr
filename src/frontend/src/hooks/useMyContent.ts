import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AudioPost } from '@/backend';

export function useMyContent() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<AudioPost[]>({
    queryKey: ['myContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyContent();
    },
    enabled: !!actor && !actorFetching,
  });

  const editPost = useMutation({
    mutationFn: async ({ postId, title, description }: { postId: string; title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editAudioPost(postId, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAudioPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    editPost,
    deletePost,
  };
}
