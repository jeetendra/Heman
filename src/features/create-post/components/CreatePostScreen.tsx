import { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

import { useCameraPermission } from '../hooks/useCameraPermission';
import { useCreatePost } from '../hooks/useCreatePost';
import { CameraView } from './CameraView';
import { PhotoPreview } from './PhotoPreview';

// Hardcoded for now — in a real app this comes from auth context
const CURRENT_USER_ID = 'u1';

type Step = 'camera' | 'preview';

interface CreatePostScreenProps {
  onDismiss: () => void;
}

export function CreatePostScreen({ onDismiss }: CreatePostScreenProps) {
  const insets    = useSafeAreaInsets();
  const scheme    = useColorScheme() ?? 'light';
  const colors    = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { granted, requesting, request } = useCameraPermission();
  const createPost = useCreatePost();

  const [step,     setStep]     = useState<Step>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption,  setCaption]  = useState('');
  const [location, setLocation] = useState('');

  // ── Permission not yet granted ────────────────────────────────────────────
  if (!granted) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText style={styles.permissionEmoji}>📷</ThemedText>
        <ThemedText type="smallBold" style={styles.permissionTitle}>
          Camera access needed
        </ThemedText>
        <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
          Allow camera access to take photos for your posts.
        </ThemedText>
        {!requesting && (
          <TouchableOpacity style={styles.permissionBtn} onPress={request} activeOpacity={0.8}>
            <ThemedText type="smallBold" style={styles.permissionBtnText}>
              Allow Camera
            </ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDismiss} style={styles.cancelLink}>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>Cancel</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePhotoTaken(uri: string) {
    setPhotoUri(uri);
    setStep('preview');
  }

  function handleRetake() {
    setPhotoUri(null);
    setCaption('');
    setLocation('');
    createPost.reset();
    setStep('camera');
  }

  async function handleSubmit() {
    if (!photoUri) return;

    createPost.mutate(
      {
        localImageUri: photoUri,
        caption:       caption.trim() || undefined,
        location:      location.trim() || undefined,
        userId:        CURRENT_USER_ID,
      },
      {
        onSuccess: () => {
          // Short delay so the user sees the success state before dismissal
          setTimeout(onDismiss, 300);
        },
      },
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.backgroundElement }]}>
        <TouchableOpacity onPress={step === 'preview' ? handleRetake : onDismiss} activeOpacity={0.7}>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            {step === 'preview' ? '← Back' : '✕ Cancel'}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText type="smallBold" style={styles.headerTitle}>
          {step === 'camera' ? 'New Post' : 'Preview'}
        </ThemedText>
        {/* placeholder to centre the title */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Body */}
      {step === 'camera' ? (
        <CameraView onPhotoTaken={handlePhotoTaken} />
      ) : (
        <PhotoPreview
          uri={photoUri!}
          caption={caption}
          location={location}
          onCaptionChange={setCaption}
          onLocationChange={setLocation}
          onRetake={handleRetake}
          onSubmit={handleSubmit}
          isSubmitting={createPost.isPending}
          error={createPost.isError ? (createPost.error as Error).message : null}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  centered:   { alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: Spacing.two },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical:   Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle:   { fontSize: 16 },
  headerSpacer:  { width: 60 },
  permissionEmoji:  { fontSize: 48 },
  permissionTitle:  { fontSize: 18, marginTop: Spacing.two },
  permissionBtn: {
    marginTop:      Spacing.three,
    backgroundColor:'#3897f0',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius:   10,
  },
  permissionBtnText: { color: '#fff' },
  cancelLink:    { marginTop: Spacing.two },
});
