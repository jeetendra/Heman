import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DeviceInfoData {
  model: string;
  brand: string;
  osVersion: string;
  sdkVersion: number;
  deviceId: string;
  manufacturer: string;
}

// ─── Module reference ─────────────────────────────────────────────────────────

// requireNativeModule("DeviceInfo") maps to Name("DeviceInfo") in Kotlin.
// We wrap it in a try/catch so the module doesn't crash on web or in
// Expo Go where the native code isn't present.
const NativeDeviceInfo = (() => {
  try {
    return requireNativeModule("DeviceInfo");
  } catch {
    return null;
  }
})();

const isSupported = Platform.OS === "android" && NativeDeviceInfo !== null;

function notSupported(name: string): never {
  throw new Error(
    `DeviceInfo.${name}() is only supported on Android. Current platform: ${Platform.OS}`
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
// These come from the Constants{} block in Kotlin.
// With expo-modules-core they are available directly as properties
// on the module object — no method call needed.

export const constants = {
  DEVICE_NAME: isSupported ? (NativeDeviceInfo.DEVICE_NAME as string) ?? "" : "",
  OS_VERSION:  isSupported ? (NativeDeviceInfo.OS_VERSION  as string) ?? "" : "",
};

// ─── Async functions ──────────────────────────────────────────────────────────
// In expo-modules-core, AsyncFunction definitions are exposed as plain
// async functions on the module object — call them directly.

export async function getBatteryLevel(): Promise<number> {
  if (!isSupported) notSupported("getBatteryLevel");
  return NativeDeviceInfo!.getBatteryLevel();
}

export async function isCharging(): Promise<boolean> {
  if (!isSupported) notSupported("isCharging");
  return NativeDeviceInfo!.isCharging();
}

export async function getDeviceInfo(): Promise<DeviceInfoData> {
  if (!isSupported) notSupported("getDeviceInfo");
  return NativeDeviceInfo!.getDeviceInfo();
}
