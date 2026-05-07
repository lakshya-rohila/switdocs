import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
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
import { convertImage, type ConvertFormat } from '../../services/converter/ImageProcessor';
import { showToast } from '../../utils/toast';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_CONVERTER>;

const FORMATS: { key: ConvertFormat; label: string; description: string }[] = [
  { key: 'JPG', label: 'JPG', description: 'Best for photos · smaller file' },
  { key: 'PNG', label: 'PNG', description: 'Lossless quality · supports transparency' },
  { key: 'WebP', label: 'WebP', description: 'Modern format · best compression' },
];

export default function ImageConverterScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [format, setFormat] = useState<ConvertFormat>('JPG');
  const [done, setDone] = useState(false);
  const { pickImageFromFiles } = useFilePicker();
  const showModal = useModal();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickImageFromFiles();
      if (file) { setPicked(file); setDone(false); }
    } finally {
      setBusy(false);
    }
  }

  async function convert() {
    if (!picked) return;
    setBusy(true);
    try {
      await convertImage(picked.uri, format);
      setDone(true);
      showToast.success(`Converted to ${format}!`, 'File saved to your Downloads folder.');
    } catch (e) {
      showModal({ title: 'Conversion failed', message: e instanceof Error ? e.message : 'Could not convert image.', buttons: [{ label: 'OK', style: 'cancel' }] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Convert Image"
      subtitle="Change image format"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={busy ? 'Converting…' : `Convert to ${format}`}
          onPress={() => convert().catch(() => {})}
          disabled={!picked || busy}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message={`Converting to ${format}…`} />

      {picked ? (
        <>
          <ImagePreviewCard uri={picked.uri} onRemove={() => { setPicked(null); setDone(false); }} />
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
          hint="JPG, PNG or WebP from your gallery or files"
          onPress={() => pickFile().catch(() => {})}
          busy={busy}
        />
      )}

      <SectionLabel text="Convert to" />
      <View style={{ gap: spacing.sm }}>
        {FORMATS.map(f => (
          <OptionRow
            key={f.key}
            label={f.label}
            description={f.description}
            selected={format === f.key}
            onPress={() => { setFormat(f.key); setDone(false); }}
          />
        ))}
      </View>

      {done ? (
        <InfoBox icon="check-circle" text={`Converted to ${format} and saved to your Downloads folder.`} />
      ) : (
        <InfoBox icon="image" text="Select the target format above. The original file is kept unchanged." />
      )}
    </ToolShell>
  );
}
