/**
 * Minimal GraphQL fetch client.
 *
 * URL resolution order:
 *  1. expoConfig.hostUri  — present in Expo Go and dev builds, contains the
 *     host IP the device already uses to talk to Metro (e.g. "192.168.1.5:8081").
 *     We strip the Metro port and append our GraphQL port.
 *  2. Android emulator fallback  → 10.0.2.2 (routes to host machine)
 *  3. Everything else fallback   → localhost
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const GQL_PORT = 4000;

function resolveHost(): string {
  const hostUri: string | undefined = Constants.expoConfig?.hostUri;
  if (hostUri) return hostUri.split(':')[0]; // strip Metro port
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export const GQL_ENDPOINT = `http://${resolveHost()}:${GQL_PORT}`;

if (__DEV__) {
  console.log('[GraphQL] endpoint →', GQL_ENDPOINT);
}

export async function gqlFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Network error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors?.length) {
    const message = json.errors
      .map((e: { message: string }) => e.message)
      .join('\n');
    throw new Error(message);
  }

  return json.data as T;
}
