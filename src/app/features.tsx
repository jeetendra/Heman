import { CameraView, useCameraPermissions } from 'expo-camera';
import { File, Paths } from 'expo-file-system';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────
type SectionStatus = 'idle' | 'active' | 'error';

interface SectionState {
  status: SectionStatus;
  info: string;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function FeaturesScreen() {
  // --- CAMERA ---
  // useCameraPermissions() returns [permission object, requestPermission function]
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // --- GPS / LOCATION ---
  const [locationState, setLocationState] = useState<SectionState>({
    status: 'idle',
    info: 'Press the button to get your GPS coordinates.',
  });

  // --- STORAGE ---
  const [storageState, setStorageState] = useState<SectionState>({
    status: 'idle',
    info: 'Press the button to read/write a file.',
  });

  // --- BLUETOOTH ---
  // expo-bluetooth is still experimental; we show device info instead
  const [bluetoothState, setBluetoothState] = useState<SectionState>({
    status: 'idle',
    info: 'Press the button to simulate a Bluetooth scan.',
  });

  // ─────────────────────────────────────────────
  // CAMERA HANDLER
  // ─────────────────────────────────────────────
  const handleCamera = async () => {
    // Step 1 – ask for permission if we don't have it yet
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }
    }
    // Step 2 – toggle the live camera preview on/off
    setCameraActive((prev) => !prev);
  };

  // ─────────────────────────────────────────────
  // GPS HANDLER
  // ─────────────────────────────────────────────
  const handleGPS = async () => {
    setLocationState({ status: 'active', info: 'Fetching location...' });

    // Step 1 – request foreground location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationState({ status: 'error', info: 'Location permission denied.' });
      return;
    }

    // Step 2 – get the current position (accuracy: Balanced is a good default)
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Step 3 – display the coordinates
    setLocationState({
      status: 'active',
      info: `Latitude:  ${loc.coords.latitude.toFixed(6)}\nLongitude: ${loc.coords.longitude.toFixed(6)}\nAltitude:  ${loc.coords.altitude?.toFixed(1) ?? 'N/A'} m`,
    });
  };

  // ─────────────────────────────────────────────
  // STORAGE HANDLER
  // ─────────────────────────────────────────────
  const handleStorage = async () => {
    setStorageState({ status: 'active', info: 'Working with storage...' });

    // Paths.document is the app's private folder on the device
    // new File() creates a reference to a file (doesn't create it yet)
    const file = new File(Paths.document, 'demo.txt');
    const content = `Hello from Expo!\nWritten at: ${new Date().toLocaleTimeString()}`;

    // Step 1 – write a text file using the new SDK 56 API
    await file.write(content);

    // Step 2 – read it back to confirm
    const readBack = await file.text();

    // Step 3 – get file size
    const size = file.size;

    setStorageState({
      status: 'active',
      info: `File written & read successfully!\n\nContent:\n"${readBack}"\n\nSize: ${size ?? 'N/A'} bytes`,
    });
  };

  // ─────────────────────────────────────────────
  // BLUETOOTH HANDLER (simulated scan)
  // expo-bluetooth is experimental and requires a custom build.
  // This demo shows the pattern — replace with real BLE calls once
  // the library stabilises for SDK 56.
  // ─────────────────────────────────────────────
  const handleBluetooth = () => {
    setBluetoothState({ status: 'active', info: 'Scanning for devices...' });

    // Simulate an async scan with a timeout
    setTimeout(() => {
      const fakeDevices = [
        '📱 Galaxy Buds Pro  — AA:BB:CC:DD:EE:01',
        '🖥️  MacBook Pro       — AA:BB:CC:DD:EE:02',
        '🎮 DualSense         — AA:BB:CC:DD:EE:03',
      ];
      setBluetoothState({
        status: 'active',
        info: `Found ${fakeDevices.length} devices nearby:\n\n${fakeDevices.join('\n')}`,
      });
    }, 2000);
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Device Features</Text>

      {/* ── CAMERA SECTION ── */}
      <Section title="📷 Camera">
        {cameraActive ? (
          // CameraView renders a live camera preview
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        ) : (
          <Text style={styles.infoText}>
            {cameraPermission?.granted
              ? 'Camera permission granted. Tap below to open.'
              : 'Camera permission not yet granted.'}
          </Text>
        )}
        <Button
          label={cameraActive ? 'Close Camera' : 'Open Camera'}
          onPress={handleCamera}
          color={cameraActive ? '#e74c3c' : '#3498db'}
        />
      </Section>

      {/* ── GPS SECTION ── */}
      <Section title="📍 GPS Location">
        <StatusInfo state={locationState} />
        <Button label="Get My Location" onPress={handleGPS} color="#2ecc71" />
      </Section>

      {/* ── STORAGE SECTION ── */}
      <Section title="💾 Storage">
        <StatusInfo state={storageState} />
        <Button label="Write & Read File" onPress={handleStorage} color="#9b59b6" />
      </Section>

      {/* ── BLUETOOTH SECTION ── */}
      <Section title="🔵 Bluetooth">
        <StatusInfo state={bluetoothState} />
        <Button label="Scan for Devices" onPress={handleBluetooth} color="#1abc9c" />
      </Section>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────

// Section wrapper — gives each feature a titled card
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// Displays the status text for GPS / Storage / Bluetooth
function StatusInfo({ state }: { state: SectionState }) {
  const color =
    state.status === 'error'
      ? '#e74c3c'
      : state.status === 'active'
      ? '#2ecc71'
      : '#aaa';

  return <Text style={[styles.infoText, { color }]}>{state.info}</Text>;
}

// Reusable button
function Button({
  label,
  onPress,
  color,
}: {
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 12,
    lineHeight: 20,
  },
  camera: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
