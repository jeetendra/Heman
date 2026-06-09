import { Image } from 'expo-image';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

const IMAGE_SIZE = Dimensions.get('window').width;

interface PhotoPreviewProps {
  uri: string;
  caption: string;
  location: string;
  onCaptionChange: (text: string) => void;
  onLocationChange: (text: string) => void;
  onRetake: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function PhotoPreview({
  uri,
  caption,
  location,
  onCaptionChange,
  onLocationChange,
  onRetake,
  onSubmit,
  isSubmitting,
  error,
}: PhotoPreviewProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {/* Preview image */}
      <Image source={{ uri }} style={styles.image} contentFit="cover" />

      <View style={styles.form}>
        {/* Caption */}
        <TextInput
          style={[
            styles.input,
            styles.captionInput,
            {
              backgroundColor: colors.backgroundElement,
              color:            colors.text,
            },
          ]}
          placeholder="Write a caption…"
          placeholderTextColor={colors.textSecondary}
          value={caption}
          onChangeText={onCaptionChange}
          multiline
          maxLength={300}
          editable={!isSubmitting}
        />

        {/* Location */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.backgroundElement, color: colors.text },
          ]}
          placeholder="📍 Add location"
          placeholderTextColor={colors.textSecondary}
          value={location}
          onChangeText={onLocationChange}
          maxLength={100}
          editable={!isSubmitting}
        />

        {/* Error */}
        {error ? (
          <ThemedText type="small" style={styles.errorText}>
            ⚠️ {error}
          </ThemedText>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.retakeBtn, { borderColor: colors.backgroundElement }]}
            onPress={onRetake}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            <ThemedText type="small" style={{ color: colors.textSecondary }}>
              Retake
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.shareBtn, isSubmitting && styles.btnDisabled]}
            onPress={onSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText type="smallBold" style={styles.shareBtnText}>
                Share
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flexGrow: 1 },
  image:       { width: IMAGE_SIZE, height: IMAGE_SIZE },
  form:        { padding: Spacing.three, gap: Spacing.two },
  input: {
    borderRadius:  10,
    paddingHorizontal: Spacing.three,
    paddingVertical:   Spacing.two,
    fontSize:          15,
  },
  captionInput: { minHeight: 80, textAlignVertical: 'top' },
  errorText:   { color: '#e74c3c', marginTop: Spacing.one },
  actions: {
    flexDirection:  'row',
    gap:            Spacing.two,
    marginTop:      Spacing.two,
  },
  btn: {
    flex:           1,
    paddingVertical: Spacing.two,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  retakeBtn:   { borderWidth: 1 },
  shareBtn:    { backgroundColor: '#3897f0' },
  btnDisabled: { opacity: 0.6 },
  shareBtnText:{ color: '#fff' },
});
