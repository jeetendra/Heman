import { useCameraPermissions } from 'expo-camera';

/**
 * Thin wrapper around expo-camera's permission hook.
 * Returns a clean { granted, requesting, request } shape.
 */
export function useCameraPermission() {
  const [permission, requestPermission] = useCameraPermissions();

  return {
    granted:    permission?.granted ?? false,
    requesting: permission === null,   // null = not yet determined
    request:    requestPermission,
  };
}
