import { CameraView as ExpoCameraView, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface CameraViewProps {
  onPhotoTaken: (uri: string) => void;
}

export function CameraView({ onPhotoTaken }: CameraViewProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const cameraRef = useRef<ExpoCameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);

  const isFront = facing === 'front';

  async function takePicture() {
    if (!cameraRef.current || capturing) return;
    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        // On Android the front camera saves a mirrored image by default.
        // mirrorImage: false ensures the saved file matches the real world,
        // not the "selfie mirror" view.
        mirrorImage: false,
      });
      if (photo?.uri) onPhotoTaken(photo.uri);
    } finally {
      setCapturing(false);
    }
  }

  return (
    <View style={styles.container}>
      {/*
        Apply a horizontal flip to the live preview ONLY when using the front
        camera, so the viewfinder still feels like a natural mirror while the
        actual saved photo is not flipped.
      */}
      <ExpoCameraView
        ref={cameraRef}
        style={[styles.camera, isFront && styles.mirroredPreview]}
        facing={facing}
      >
        {/* Flip button */}
        <TouchableOpacity
          style={[styles.flipBtn, { backgroundColor: colors.backgroundElement }]}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.flipIcon}>🔄</ThemedText>
        </TouchableOpacity>

        {/* Shutter button */}
        <View style={styles.shutterRow}>
          <TouchableOpacity
            style={styles.shutterOuter}
            onPress={takePicture}
            activeOpacity={0.8}
            disabled={capturing}
          >
            <View style={styles.shutterInner}>
              {capturing && <ActivityIndicator size="small" color="#000" />}
            </View>
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera:    { flex: 1 },
  // Flips the live preview horizontally so the front camera feels like a mirror.
  // This does NOT affect the saved photo — mirrorImage:false handles that.
  mirroredPreview: { transform: [{ scaleX: -1 }] },
  flipBtn: {
    position:  'absolute',
    top:       Spacing.four,
    right:     Spacing.three,
    padding:   Spacing.two,
    borderRadius: 24,
  },
  flipIcon:  { fontSize: 22 },
  shutterRow: {
    position:       'absolute',
    bottom:         Spacing.five,
    left:           0,
    right:          0,
    alignItems:     'center',
  },
  shutterOuter: {
    width:         72,
    height:        72,
    borderRadius:  36,
    borderWidth:   4,
    borderColor:   '#fff',
    alignItems:    'center',
    justifyContent:'center',
  },
  shutterInner: {
    width:         56,
    height:        56,
    borderRadius:  28,
    backgroundColor: '#fff',
    alignItems:    'center',
    justifyContent:'center',
  },
});
