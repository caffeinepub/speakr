import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AudioPost } from '@/backend';

const QUERY_TIMEOUT = 30000; // 30 seconds
const MUTATION_TIMEOUT = 30000;

export function useMyContent() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<AudioPost[]>({
    queryKey: ['myContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 30 seconds. Please check your connection.')), QUERY_TIMEOUT);
      });
      
      return Promise.race([
        actor.getMyContent(),
        timeoutPromise
      ]);
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: 1000,
  });

  const editPost = useMutation({
    mutationFn: async ({ postId, title, description }: { postId: string; title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Edit timed out. Please try again.')), MUTATION_TIMEOUT);
      });
      
      return Promise.race([
        actor.editAudioPost(postId, title, description),
        timeoutPromise
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Delete timed out. Please try again.')), MUTATION_TIMEOUT);
      });
      
      return Promise.race([
        actor.removeAudioPost(postId),
        timeoutPromise
      ]);
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
