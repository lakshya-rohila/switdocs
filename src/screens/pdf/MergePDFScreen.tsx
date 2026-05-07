import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { mergeMultiplePdfs } from '../../services/pdf/PDFMerger';
import { shareLocalFile } from '../../utils/shareOpen';
import { showToast } from '../../utils/toast';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.MERGE_PDF>;

export default function MergePDFScreen({ navigation }: Props) {
  useAppTheme();
  const showModal = useModal();
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [resultPath, setResultPath] = useState<string | null>(null);
  const { pickMultiplePdfs } = useFilePicker();

  async function addFiles() {
    setBusy(true);
    try {
      const picked = await pickMultiplePdfs();
      if (picked.length > 0) {
        setFiles(prev => {
          const existing = new Set(prev.map(f => f.uri));
          return [...prev, ...picked.filter(f => !existing.has(f.uri))];
        });
        setResultPath(null);
      }
    } finally {
      setBusy(false);
    }
  }

  function removeFile(uri: string) {
    setFiles(prev => prev.filter(f => f.uri !== uri));
    setResultPath(null);
  }

  async function merge() {
    if (files.length < 2) {
      showModal({
        title: 'Add more files',
        message: 'Please select at least 2 PDF files to merge.',
        buttons: [{ label: 'OK', style: 'cancel' }],
      });
      return;
    }
    setBusy(true);
    try {
      const uris = files.map(f => f.uri);
      const output = await mergeMultiplePdfs(uris);
      setResultPath(output);
      showToast.success('PDFs merged!', 'Saved to your Downloads folder.');
    } catch (e) {
      showModal({
        title: 'Merge failed',
        message: e instanceof Error ? e.message : 'Could not merge PDFs. Please try again.',
        buttons: [{ label: 'OK', style: 'cancel' }],
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Merge PDFs"
      subtitle="Combine multiple PDFs into one"
      navigation={navigation}
      bottomBar={
        <View style={{ gap: spacing.sm }}>
          <BigButton label="Add PDF files" onPress={() => addFiles().catch(() => {})} loading={busy} variant="ghost" />
          <BigButton label={`Merge ${files.length} files`} onPress={() => merge().catch(() => {})} disabled={files.length < 2 || busy} loading={busy} />
        </View>
      }
    >
      <ProgressOverlay visible={busy} message="Merging PDFs…" />

      {files.length === 0 ? (
        <PickerCard
          label="Tap to add PDF files"
          hint="You can select multiple files at once"
          onPress={() => addFiles().catch(() => {})}
          busy={busy}
        />
      ) : (
        <>
          <SectionLabel text={`${files.length} file${files.length !== 1 ? 's' : ''} queued`} />
          {files.map((file, index) => (
            <PickerCard
              key={file.uri}
              label={`${index + 1}. ${file.name}`}
              fileSize={file.size != null ? `${(file.size / 1024).toFixed(0)} KB` : undefined}
              fileName={file.name}
              onPress={() => removeFile(file.uri)}
            />
          ))}
          <BigButton label="+ Add more files" onPress={() => addFiles().catch(() => {})} variant="ghost" />
        </>
      )}

      {resultPath ? (
        <InfoBox icon="check-circle" text="PDFs merged and saved to your Downloads folder." />
      ) : (
        <InfoBox
          icon="info"
          text="Merge PDFs combines multiple files in the order you add them. Tap a file to remove it."
        />
      )}
    </ToolShell>
  );
}
