import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

export function useAddAudioPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, audioBlob }: { title: string; description: string; audioBlob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAudioPost(title, description, audioBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
    },
  });
}

export function useListenToAudioPost() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.listenToAudioPost(postId);
    },
  });
}

export function useRemoveAudioPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAudioPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
      toast.success('Post deleted successfully');
    },
    onError: (error: Error) => {
      if (error.message.includes('Unauthorized')) {
        toast.error('You can only delete your own posts');
      } else {
        toast.error('Failed to delete post', {
          description: error.message,
        });
      }
    },
  });
}
