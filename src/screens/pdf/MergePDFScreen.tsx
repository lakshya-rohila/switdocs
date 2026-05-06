import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.MERGE_PDF>;

export default function MergePDFScreen({ navigation }: Props) {
  useAppTheme();
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<PickedFile[]>([]);
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
      }
    } finally {
      setBusy(false);
    }
  }

  function removeFile(uri: string) {
    setFiles(prev => prev.filter(f => f.uri !== uri));
  }

  function attemptMerge() {
    if (files.length < 2) {
      Alert.alert('Add more files', 'Please select at least 2 PDF files to merge.');
      return;
    }
    Alert.alert(
      'Not available offline',
      'PDF merging requires a conversion engine not included in this build. You can share the files individually.',
      [
        { text: 'Share first PDF', onPress: () => shareLocalFile({ path: files[0].uri, mime: 'application/pdf', title: files[0].name }).catch(() => {}) },
        { text: 'OK', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Merge PDFs"
      subtitle="Combine multiple PDFs into one"
      navigation={navigation}
      bottomBar={
        <View style={{ gap: spacing.sm }}>
          <BigButton label="Add PDF files" onPress={() => addFiles().catch(() => {})} loading={busy} variant="ghost" />
          <BigButton label={`Merge ${files.length} files`} onPress={attemptMerge} disabled={files.length < 2} />
        </View>
      }
    >
      <ProgressOverlay visible={busy} message="Loading files…" />

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

      <InfoBox
        icon="ℹ️"
        text="Merge PDFs combines multiple files in the order you add them. Drag to reorder is coming soon."
      />
    </ToolShell>
  );
}
