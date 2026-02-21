import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

export function useAddAudioPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      description, 
      audioBlob, 
      replyTo 
    }: { 
      title: string; 
      description: string; 
      audioBlob: ExternalBlob;
      replyTo?: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Ensure replyTo is either a string or null (not undefined)
      const replyToValue = replyTo !== undefined ? replyTo : null;
      
      return actor.addAudioPost(title, description, audioBlob, replyToValue);
    },
    onSuccess: (_, variables) => {
      // Invalidate user's content
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
      
      // If this is a reply, invalidate the replies for the parent post
      if (variables.replyTo) {
        queryClient.invalidateQueries({ queryKey: ['audioReplies', variables.replyTo] });
      }
    },
    onError: (error: Error) => {
      console.error('Add audio post mutation error:', error);
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
      queryClient.invalidateQueries({ queryKey: ['favoritePosts'] });
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

export function useAddToFavorites() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToFavorites(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoritePosts'] });
      toast.success('Added to favorites');
    },
    onError: (error: Error) => {
      if (error.message.includes('Unauthorized')) {
        toast.error('Please sign in to add favorites');
      } else if (error.message.includes('already favorited')) {
        toast.error('Already in your favorites');
      } else {
        toast.error('Failed to add to favorites', {
          description: error.message,
        });
      }
    },
  });
}

export function useRemoveFromFavorites() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromFavorites(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoritePosts'] });
      toast.success('Removed from favorites');
    },
    onError: (error: Error) => {
      if (error.message.includes('Unauthorized')) {
        toast.error('Please sign in to manage favorites');
      } else {
        toast.error('Failed to remove from favorites', {
          description: error.message,
        });
      }
    },
  });
}
