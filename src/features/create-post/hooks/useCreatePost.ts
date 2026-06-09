import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage, createPost } from '../api/createPostApi';
import type { CreatePostInput } from '../types';

interface SubmitPostParams {
  localImageUri: string;
  caption?: string;
  location?: string;
  userId: string;
}

/**
 * Two-step mutation:
 *   1. Upload the local image → get back a hosted URL
 *   2. Call createPost mutation with that URL
 *
 * On success, invalidates the 'feed' query so the list refreshes.
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ localImageUri, caption, location, userId }: SubmitPostParams) => {
      // Step 1: upload the photo, get a hosted URL
      const imageUrl = await uploadImage(localImageUri);

      // Step 2: create the post in GraphQL
      const input: CreatePostInput = { imageUrl, caption, location, userId };
      return createPost(input);
    },

    onSuccess: () => {
      // Bust the feed cache so the new post appears at the top
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
