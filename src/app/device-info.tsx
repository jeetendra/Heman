/**
 * DeviceInfoScreen
 *
 * A demo screen that calls our native module and displays the results.
 * Navigate here to see the native module in action.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as DeviceInfo from "device-info";

// ─── Types ────────────────────────────────────────────────────────────────────

interface State {
  batteryLevel: number | null;
  charging: boolean | null;
  deviceInfo: DeviceInfo.DeviceInfoData | null;
  loading: boolean;
  error: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DeviceInfoScreen() {
  const [state, setState] = useState<State>({
    batteryLevel: null,
    charging: null,
    deviceInfo: null,
    loading: false,
    error: null,
  });

  /**
   * Calls all three native module methods in parallel using Promise.all.
   * This is more efficient than calling them sequentially — the native
   * bridge handles each call on its own thread.
   */
  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [batteryLevel, charging, deviceInfo] = await Promise.all([
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.isCharging(),
        DeviceInfo.getDeviceInfo(),
      ]);
      setState({ batteryLevel, charging, deviceInfo, loading: false, error: null });
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, []);

  // Auto-fetch when the screen mounts
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Device Info Native Module</Text>
      <Text style={styles.subtitle}>
        Data fetched directly from Android APIs via a custom Native Module.
      </Text>

      {/* Sync constants — available instantly, no async needed */}
      <Section title="Sync Constants (getConstants)">
        <Row label="Device Name" value={DeviceInfo.constants.DEVICE_NAME} />
        <Row label="OS Version" value={DeviceInfo.constants.OS_VERSION} />
      </Section>

      {state.loading && (
        <ActivityIndicator size="large" color="#208AEF" style={styles.spinner} />
      )}

      {state.error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}

      {/* Async battery data */}
      {state.batteryLevel !== null && (
        <Section title="Battery (async)">
          <BatteryBar level={state.batteryLevel} />
          <Row label="Level" value={`${state.batteryLevel}%`} />
          <Row label="Charging" value={state.charging ? "Yes ⚡" : "No 🔋"} />
        </Section>
      )}

      {/* Async device info */}
      {state.deviceInfo && (
        <Section title="Device Info (async)">
          <Row label="Model" value={state.deviceInfo.model} />
          <Row label="Brand" value={state.deviceInfo.brand} />
          <Row label="Manufacturer" value={state.deviceInfo.manufacturer} />
          <Row label="Android" value={state.deviceInfo.osVersion} />
          <Row label="SDK" value={String(state.deviceInfo.sdkVersion)} />
          <Row label="Build ID" value={state.deviceInfo.deviceId} />
        </Section>
      )}

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchAll}
        accessibilityLabel="Refresh device information"
        accessibilityRole="button"
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function BatteryBar({ level }: { level: number }) {
  const color = level > 50 ? "#34C759" : level > 20 ? "#FF9500" : "#FF3B30";
  return (
    <View style={styles.batteryTrack}>
      <View style={[styles.batteryFill, { width: `${level}%` as any, backgroundColor: color }]} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#1C1C1E", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6E6E73", marginBottom: 24 },
  spinner: { marginVertical: 20 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#208AEF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  rowLabel: { fontSize: 15, color: "#3A3A3C" },
  rowValue: { fontSize: 15, fontWeight: "500", color: "#1C1C1E" },
  batteryTrack: {
    height: 10,
    backgroundColor: "#E5E5EA",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  batteryFill: { height: "100%", borderRadius: 5 },
  errorBox: {
    backgroundColor: "#FFF2F2",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  errorText: { color: "#FF3B30", fontSize: 14 },
  refreshButton: {
    backgroundColor: "#208AEF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  refreshButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
