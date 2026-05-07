import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ToolShell,
  PickerCard,
  BigButton,
  InfoBox,
} from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { imagesToPdf } from '../../services/converter/ImageProcessor';
import { showToast } from '../../utils/toast';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.DOCUMENT_CONVERTER>;

export default function ConverterScreen({ navigation }: Props) {
  const showModal = useModal();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [done, setDone] = useState(false);
  const { pickImageFromFiles } = useFilePicker();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickImageFromFiles();
      if (file) { setPicked(file); setDone(false); }
    } finally {
      setBusy(false);
    }
  }

  async function runConversion() {
    if (!picked) return;
    setBusy(true);
    try {
      const title = picked.name.replace(/\.[^.]+$/, '') || 'Image';
      await imagesToPdf([picked.uri], title);
      setDone(true);
      showToast.success('PDF created!', 'Saved to your Downloads folder.');
    } catch (e) {
      showModal({
        title: 'Conversion failed',
        message: e instanceof Error ? e.message : 'Could not convert image to PDF.',
        buttons: [{ label: 'OK', style: 'cancel' }],
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Image to PDF"
      subtitle="Convert images to PDF on-device"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={busy ? 'Converting…' : done ? 'Convert another' : 'Convert to PDF'}
          onPress={() => runConversion().catch(() => {})}
          disabled={!picked || busy}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message="Converting…" />

      <PickerCard
        label="Select an image"
        hint="JPG or PNG from your gallery or files"
        onPress={() => pickFile().catch(() => {})}
        fileName={picked?.name}
        fileSize={picked?.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
        busy={busy}
      />

      {done ? (
        <InfoBox icon="check-circle" text="PDF created and saved to your Downloads folder." />
      ) : (
        <InfoBox icon="zap" text="Converts your image to a PDF entirely on-device. No internet needed — your file never leaves your phone." />
      )}
    </ToolShell>
  );
}
