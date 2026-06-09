import { GQL_ENDPOINT } from '@/shared/lib/graphqlClient';
import type { CreatePostInput, CreatePostResult, UploadResponse } from '../types';

/** Upload server lives on port 4001 — derived from the same host as GraphQL. */
function getUploadEndpoint(): string {
  // GQL_ENDPOINT is like "http://192.168.1.5:4000"
  const base = GQL_ENDPOINT.replace(':4000', ':4001');
  return `${base}/upload`;
}

/**
 * Step 1 — Upload a local image file to the REST /upload endpoint.
 *
 * Why XMLHttpRequest instead of fetch?
 * React Native's fetch polyfill does NOT support the { uri, name, type }
 * FormData entry shape — it throws "unsupported FormDataPart implementation".
 * XHR goes through a different native path that correctly handles file URIs
 * as multipart parts, which is the standard workaround in React Native.
 */
export function uploadImage(localUri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    // XHR's FormData understands the { uri, name, type } shape in React Native
    formData.append('photo', {
      uri:  localUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUploadEndpoint());

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: UploadResponse = JSON.parse(xhr.responseText);
          resolve(data.url);
        } catch {
          reject(new Error('Invalid JSON response from upload server'));
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.ontimeout = () => reject(new Error('Upload timed out'));
    xhr.timeout = 30_000; // 30 s

    xhr.send(formData);
  });
}

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      imageUrl
      caption
      location
      createdAt
      user {
        id
        username
        avatarUrl
      }
    }
  }
`;

/**
 * Step 2 — Call the createPost GraphQL mutation with the uploaded image URL.
 */
export async function createPost(input: CreatePostInput): Promise<CreatePostResult> {
  const response = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: CREATE_POST_MUTATION, variables: { input } }),
  });

  if (!response.ok) {
    throw new Error(`Network error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join('\n'));
  }

  return json.data as CreatePostResult;
}
