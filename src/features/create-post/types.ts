export interface CreatePostInput {
  imageUrl: string;
  caption?: string;
  location?: string;
  userId: string;
}

export interface CreatePostResult {
  createPost: {
    id: string;
    imageUrl: string;
    caption: string | null;
    location: string | null;
    createdAt: string;
  };
}

/** Shape of the /upload REST response */
export interface UploadResponse {
  url: string;
}
