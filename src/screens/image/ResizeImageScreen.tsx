import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, OptionRow, ImagePreviewCard, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_RESIZE>;

const PRESETS = [
  { key: '25', label: '25%', description: 'Quarter size · very small file' },
  { key: '50', label: '50%', description: 'Half size · good for sharing' },
  { key: '75', label: '75%', description: 'Three-quarters · high quality' },
  { key: '100', label: '100%', description: 'Original size · no change' },
] as const;

export default function ResizeImageScreen({ navigation }: Props) {
  useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [scale, setScale] = useState<'25' | '50' | '75' | '100'>('50');
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

  function resize() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'Image resizing requires a native codec not included in this build. You can share the original image.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: picked.mime ?? 'image/jpeg', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Resize Image"
      subtitle="Make it smaller or larger"
      navigation={navigation}
      bottomBar={
        <BigButton label={`Resize to ${scale}%`} onPress={resize} disabled={!picked} loading={busy} />
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

      <SectionLabel text="Resize to" />
      <View style={{ gap: spacing.sm }}>
        {PRESETS.map(p => (
          <OptionRow
            key={p.key}
            label={p.label}
            description={p.description}
            selected={scale === p.key}
            onPress={() => setScale(p.key)}
          />
        ))}
      </View>

      <InfoBox icon="📐" text="Resizing reduces the pixel dimensions of your image while keeping the aspect ratio." />
    </ToolShell>
  );
}
