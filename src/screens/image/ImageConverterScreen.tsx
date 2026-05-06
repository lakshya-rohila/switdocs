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

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_CONVERTER>;

const FORMATS = [
  { key: 'JPG', label: 'JPG', description: 'Best for photos · smaller file size' },
  { key: 'PNG', label: 'PNG', description: 'Best for graphics · lossless quality' },
  { key: 'WebP', label: 'WebP', description: 'Modern format · smallest size' },
] as const;

export default function ImageConverterScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [format, setFormat] = useState<'JPG' | 'PNG' | 'WebP'>('JPG');
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

  function convert() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'Image format conversion requires a native codec not included in this build. You can share the original image.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: picked.mime ?? 'image/jpeg', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Convert Image"
      subtitle="Change image format"
      navigation={navigation}
      bottomBar={
        <BigButton label={`Convert to ${format}`} onPress={convert} disabled={!picked} loading={busy} />
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

      <SectionLabel text="Convert to format" />
      <View style={{ gap: spacing.sm }}>
        {FORMATS.map(f => (
          <OptionRow
            key={f.key}
            label={f.label}
            description={f.description}
            selected={format === f.key}
            onPress={() => setFormat(f.key)}
          />
        ))}
      </View>

      <InfoBox icon="🖼️" text="Converting changes the file format. The image content stays the same." />
    </ToolShell>
  );
}
