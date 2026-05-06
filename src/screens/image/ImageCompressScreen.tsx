import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, ImagePreviewCard, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_COMPRESS>;

export default function ImageCompressScreen({ navigation }: Props) {
  const { colors, typography } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [quality, setQuality] = useState(75);
  const { pickImageFromFiles } = useFilePicker();

  const estimate = useMemo(() => {
    if (!picked?.size) return null;
    const kb = (picked.size / 1024) * (quality / 100);
    return `Estimated output: ~${kb.toFixed(0)} KB`;
  }, [picked, quality]);

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickImageFromFiles();
      if (file) setPicked(file);
    } finally {
      setBusy(false);
    }
  }

  function compress() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'Image compression requires a native codec not included in this build. You can share the original image.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: picked.mime ?? 'image/jpeg', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Compress Image"
      subtitle="Reduce image file size"
      navigation={navigation}
      bottomBar={
        <BigButton label="Compress image" onPress={compress} disabled={!picked} loading={busy} />
      }
    >
      <ProgressOverlay visible={busy} message="Loading…" />

      {picked ? (
        <>
          <ImagePreviewCard uri={picked.uri} onRemove={() => setPicked(null)} />
          <PickerCard label={picked.name} fileName={picked.name} fileSize={picked.size != null ? `${(picked.size / 1024).toFixed(0)} KB original` : undefined} onPress={() => pickFile().catch(() => {})} />
        </>
      ) : (
        <PickerCard
          label="Select an image"
          hint="JPG, PNG or WebP"
          onPress={() => pickFile().catch(() => {})}
          busy={busy}
        />
      )}

      <SectionLabel text={`Quality: ${quality}%`} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setQuality(q => Math.max(10, q - 10))}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 22, color: colors.primary, fontWeight: '600' }}>−</Text>
        </Pressable>
        <View style={{ flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
          <View style={{ height: '100%', width: `${quality}%` as `${number}%`, backgroundColor: colors.primary, borderRadius: 4 }} />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setQuality(q => Math.min(100, q + 10))}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 22, color: colors.primary, fontWeight: '600' }}>+</Text>
        </Pressable>
      </View>
      {estimate && <Text style={[typography.caption, { color: colors.textSecondary }]}>{estimate}</Text>}

      <InfoBox icon="💡" text="Lower quality = smaller file. 75% is a good balance between size and appearance." />
    </ToolShell>
  );
}
