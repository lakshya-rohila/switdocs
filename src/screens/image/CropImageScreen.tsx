import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, OptionRow, ImagePreviewCard, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_CROP>;

const RATIOS = [
  { key: 'free', label: 'Free crop', description: 'Drag handles to any shape' },
  { key: '1:1', label: 'Square (1:1)', description: 'Perfect for profile photos' },
  { key: '16:9', label: 'Widescreen (16:9)', description: 'Good for banners and covers' },
  { key: '4:3', label: 'Standard (4:3)', description: 'Classic photo ratio' },
] as const;

export default function CropImageScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [ratio, setRatio] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
  const { pickImageFromFiles } = useFilePicker();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickImageFromFiles();
      if (file) setPicked(file);
    } finally {
      setBusy(false);
    }
  }

  function crop() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'Image cropping requires a native module not included in this build. You can share the original image.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: picked.mime ?? 'image/jpeg', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Crop Image"
      subtitle="Trim to the right size"
      navigation={navigation}
      bottomBar={
        <BigButton label="Crop image" onPress={crop} disabled={!picked} loading={busy} />
      }
    >
      <ProgressOverlay visible={busy} message="Loading…" />

      {picked ? (
        <>
          <ImagePreviewCard uri={picked.uri} onRemove={() => setPicked(null)} />
          <PickerCard label={picked.name} fileName={picked.name} fileSize={picked.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined} onPress={() => pickFile().catch(() => {})} />
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

      <InfoBox icon="✂️" text="Choose a crop ratio then tap Crop. An interactive crop editor is coming in a future update." />
    </ToolShell>
  );
}
