import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import {
  ToolShell,
  PickerCard,
  BigButton,
  InfoBox,
  OptionRow,
  ImagePreviewCard,
  SectionLabel,
} from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { cropImage, type CropRatio } from '../../services/converter/ImageProcessor';
import { showToast } from '../../utils/toast';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_CROP>;

const RATIOS: { key: CropRatio; label: string; description: string }[] = [
  { key: 'free', label: 'Free crop', description: 'Drag handles to any shape you want' },
  { key: '1:1', label: 'Square (1:1)', description: 'Perfect for profile photos & icons' },
  { key: '16:9', label: 'Widescreen (16:9)', description: 'Great for banners and covers' },
  { key: '4:3', label: 'Standard (4:3)', description: 'Classic photo format' },
  { key: '3:4', label: 'Portrait (3:4)', description: 'Great for portraits and stories' },
];

export default function CropImageScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [ratio, setRatio] = useState<CropRatio>('free');
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const { pickImageFromFiles } = useFilePicker();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickImageFromFiles();
      if (file) { setPicked(file); setCroppedUri(null); }
    } finally {
      setBusy(false);
    }
  }

  async function crop() {
    if (!picked) return;
    setBusy(true);
    try {
      const result = await cropImage(picked.uri, ratio);
      if (!result) return; // user cancelled cropper
      setCroppedUri(result.outputPath);
      showToast.success(
        'Cropped & saved!',
        `${result.width}×${result.height}px — saved to Downloads.`,
      );
    } catch (e) {
      Alert.alert('Crop failed', e instanceof Error ? e.message : 'Could not crop image.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Crop Image"
      subtitle="Trim to the right shape"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={busy ? 'Opening cropper…' : 'Open crop editor'}
          onPress={() => crop().catch(() => {})}
          disabled={!picked || busy}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message="Opening crop editor…" />

      {croppedUri ? (
        <>
          <SectionLabel text="Cropped result" />
          <ImagePreviewCard uri={croppedUri} onRemove={() => setCroppedUri(null)} />
        </>
      ) : picked ? (
        <>
          <ImagePreviewCard uri={picked.uri} onRemove={() => { setPicked(null); setCroppedUri(null); }} />
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
          hint="JPG, PNG or WebP"
          onPress={() => pickFile().catch(() => {})}
          busy={busy}
        />
      )}

      <SectionLabel text="Crop ratio" />
      <View style={{ gap: spacing.sm }}>
        {RATIOS.map(r => (
          <OptionRow
            key={r.key}
            label={r.label}
            description={r.description}
            selected={ratio === r.key}
            onPress={() => setRatio(r.key)}
          />
        ))}
      </View>

      <InfoBox
        icon="scissors"
        text="Tap 'Open crop editor' to launch the native crop tool. Drag the handles to set your crop area, then tap the checkmark to save."
      />
    </ToolShell>
  );
}
