import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, OptionRow, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { compressPdf, type CompressionLevel } from '../../services/pdf/PDFCompressor';
import { showToast } from '../../utils/toast';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.COMPRESS_PDF>;

const LEVELS: { key: CompressionLevel; label: string; description: string }[] = [
  { key: 'low', label: 'Light compression', description: 'Best quality · moderate size reduction' },
  { key: 'medium', label: 'Medium compression', description: 'Good quality · balanced reduction' },
  { key: 'high', label: 'Maximum compression', description: 'Smallest file · strips all metadata' },
];

export default function CompressPDFScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [result, setResult] = useState<{ saved: number } | null>(null);
  const { pickDocumentFromFiles } = useFilePicker();
  const showModal = useModal();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickDocumentFromFiles();
      if (file) { setPicked(file); setResult(null); }
    } finally {
      setBusy(false);
    }
  }

  async function compress() {
    if (!picked) return;
    setBusy(true);
    try {
      const res = await compressPdf(picked.uri, level);
      const savedKb = Math.max(0, (res.originalSize - res.newSize) / 1024);
      setResult({ saved: savedKb });
      showToast.success(
        'PDF compressed!',
        savedKb > 1 ? `Saved ${savedKb.toFixed(0)} KB — file in Downloads.` : 'Saved to Downloads.',
      );
    } catch (e) {
      showModal({
        title: 'Compression failed',
        message: e instanceof Error ? e.message : 'Could not compress PDF.',
        buttons: [{ label: 'OK', style: 'cancel' }],
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Compress PDF"
      subtitle="Reduce file size"
      navigation={navigation}
      bottomBar={
        <BigButton label={result ? 'Compress again' : 'Compress PDF'} onPress={() => compress().catch(() => {})} disabled={!picked || busy} loading={busy} />
      }
    >
      <ProgressOverlay visible={busy} message="Compressing…" />

      <PickerCard
        label="Select a PDF file"
        hint="Tap here to browse your files"
        onPress={() => pickFile().catch(() => {})}
        fileName={picked?.name}
        fileSize={picked?.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
        busy={busy}
      />

      <SectionLabel text="Compression level" />
      <View style={{ gap: spacing.sm }}>
        {LEVELS.map(opt => (
          <OptionRow
            key={opt.key}
            label={opt.label}
            description={opt.description}
            selected={level === opt.key}
            onPress={() => setLevel(opt.key)}
          />
        ))}
      </View>

      {result ? (
        <InfoBox icon="check-circle" text={result.saved > 1 ? `Compressed! Saved ${result.saved.toFixed(0)} KB. File is in your Downloads.` : 'Compressed and saved to your Downloads folder.'} />
      ) : (
        <InfoBox icon="info" text="Compression reduces file size by stripping metadata and optimizing the PDF structure." />
      )}
    </ToolShell>
  );
}
