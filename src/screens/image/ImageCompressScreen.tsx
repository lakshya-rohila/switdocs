import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  ToolShell,
  PickerCard,
  BigButton,
  InfoBox,
  ImagePreviewCard,
  SectionLabel,
} from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { compressImage } from '../../services/converter/ImageProcessor';
import { showToast } from '../../utils/toast';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_COMPRESS>;

export default function ImageCompressScreen({ navigation }: Props) {
  const { colors, typography } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [quality, setQuality] = useState(75);
  const [resultPath, setResultPath] = useState<string | null>(null);
  const { pickImageFromFiles } = useFilePicker();

  const estimate = useMemo(() => {
    if (!picked?.size) return `Quality: ${quality}%`;
    const kb = (picked.size / 1024) * (quality / 100);
    return `~${kb.toFixed(0)} KB estimated output`;
  }, [picked, quality]);

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickImageFromFiles();
      if (file) { setPicked(file); setResultPath(null); }
    } finally {
      setBusy(false);
    }
  }

  async function compress() {
    if (!picked) return;
    setBusy(true);
    try {
      const result = await compressImage(picked.uri, quality);
      setResultPath(result.outputPath);
      const savedKb = Math.max(0, result.savedBytes / 1024);
      showToast.success(
        'Compressed & saved!',
        savedKb > 0
          ? `Saved ${savedKb.toFixed(0)} KB — file is in your Downloads.`
          : 'File saved to Downloads.',
      );
    } catch (e) {
      Alert.alert('Compression failed', e instanceof Error ? e.message : 'Could not compress image.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Compress Image"
      subtitle="Reduce file size"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={busy ? 'Compressing…' : resultPath ? 'Compress again' : 'Compress & save'}
          onPress={() => compress().catch(() => {})}
          disabled={!picked || busy}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message="Compressing image…" />

      {picked ? (
        <>
          <ImagePreviewCard uri={picked.uri} onRemove={() => { setPicked(null); setResultPath(null); }} />
          <PickerCard
            label={picked.name}
            fileName={picked.name}
            fileSize={picked.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
            onPress={() => pickFile().catch(() => {})}
          />
        </>
      ) : (
        <PickerCard
          label="Select an image"
          hint="JPG or PNG from your gallery or files"
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
          <Text style={{ fontSize: 22, color: colors.primary, fontWeight: '700' }}>−</Text>
        </Pressable>
        <View style={{ flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
          <View style={{ height: '100%', width: `${quality}%` as `${number}%`, backgroundColor: colors.primary, borderRadius: 4 }} />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setQuality(q => Math.min(100, q + 10))}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 22, color: colors.primary, fontWeight: '700' }}>+</Text>
        </Pressable>
      </View>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{estimate}</Text>

      {resultPath ? (
        <InfoBox icon="check-circle" text="Image compressed and saved to your Downloads folder." />
      ) : (
        <InfoBox icon="info" text="Lower quality = smaller file. 75% gives a great balance of size and clarity." />
      )}
    </ToolShell>
  );
}
