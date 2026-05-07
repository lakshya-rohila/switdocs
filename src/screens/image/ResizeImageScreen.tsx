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
import { resizeImage } from '../../services/converter/ImageProcessor';
import { showToast } from '../../utils/toast';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.IMAGE_RESIZE>;

const PRESETS = [
  { key: '25', label: '25% — Thumbnail', description: 'Very small, great for previews' },
  { key: '50', label: '50% — Half size', description: 'Good for messaging & sharing' },
  { key: '75', label: '75% — Reduced', description: 'High quality, noticeably smaller' },
  { key: '100', label: '100% — Original', description: 'No size change, re-saves as JPG' },
] as const;

export default function ResizeImageScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [scale, setScale] = useState<'25' | '50' | '75' | '100'>('50');
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

  async function resize() {
    if (!picked) return;
    setBusy(true);
    try {
      await resizeImage(picked.uri, parseInt(scale, 10));
      setDone(true);
      showToast.success('Resized & saved!', `Saved to Downloads as ${scale}% of original.`);
    } catch (e) {
      showModal({ title: 'Resize failed', message: e instanceof Error ? e.message : 'Could not resize image.', buttons: [{ label: 'OK', style: 'cancel' }] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Resize Image"
      subtitle="Make it smaller or larger"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={busy ? 'Resizing…' : `Resize to ${scale}%`}
          onPress={() => resize().catch(() => {})}
          disabled={!picked || busy}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message="Resizing image…" />

      {picked ? (
        <>
          <ImagePreviewCard uri={picked.uri} onRemove={() => { setPicked(null); setDone(false); }} />
          <PickerCard
            label={picked.name}
            fileName={picked.name}
            fileSize={picked.size != null ? `${(picked.size / 1024).toFixed(0)} KB original` : undefined}
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

      <SectionLabel text="Resize to" />
      <View style={{ gap: spacing.sm }}>
        {PRESETS.map(p => (
          <OptionRow
            key={p.key}
            label={p.label}
            description={p.description}
            selected={scale === p.key}
            onPress={() => { setScale(p.key); setDone(false); }}
          />
        ))}
      </View>

      {done ? (
        <InfoBox icon="check-circle" text="Image resized and saved to your Downloads folder." />
      ) : (
        <InfoBox icon="maximize-2" text="Resizing scales the image while keeping its aspect ratio. The original file is not changed." />
      )}
    </ToolShell>
  );
}
