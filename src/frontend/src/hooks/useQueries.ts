import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

const MUTATION_TIMEOUT = 30000; // 30 seconds

export function useAddAudioPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      description, 
      audioBlob, 
      replyTo,
      kidFriendly = false,
    }: { 
      title: string; 
      description: string; 
      audioBlob: ExternalBlob;
      replyTo?: string | null;
      kidFriendly?: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timed out after 30 seconds. Please check your connection and try again.')), MUTATION_TIMEOUT);
      });

      const replyToValue = replyTo !== undefined ? replyTo : null;
      
      return Promise.race([
        actor.addAudioPost(title, description, audioBlob, replyToValue, kidFriendly),
        timeoutPromise
      ]) as Promise<string>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['kidFriendlyPosts'] });
      
      if (variables.replyTo) {
        queryClient.invalidateQueries({ queryKey: ['audioReplies', variables.replyTo] });
      }
    },
    onError: (error: Error) => {
      console.error('Add audio post mutation error:', error);
      toast.error('Failed to upload', {
        description: error.message,
      });
    },
  });
}

export function useListenToAudioPost() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), MUTATION_TIMEOUT);
      });
      
      return Promise.race([
        actor.listenToAudioPost(postId),
        timeoutPromise
      ]) as Promise<void>;
    },
  });
}

export function useRemoveAudioPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Delete timed out. Please try again.')), MUTATION_TIMEOUT);
      });
      
      return Promise.race([
        actor.removeAudioPost(postId),
        timeoutPromise
      ]) as Promise<boolean>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['favoritePosts'] });
      queryClient.invalidateQueries({ queryKey: ['kidFriendlyPosts'] });
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
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out. Please try again.')), MUTATION_TIMEOUT);
      });
      
      return Promise.race([
        actor.addToFavorites(postId),
        timeoutPromise
      ]) as Promise<void>;
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
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out. Please try again.')), MUTATION_TIMEOUT);
      });
      
      return Promise.race([
        actor.removeFromFavorites(postId),
        timeoutPromise
      ]) as Promise<void>;
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
