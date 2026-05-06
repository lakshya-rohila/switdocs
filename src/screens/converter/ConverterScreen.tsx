import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, OptionRow, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';
import { mimeFromFilename } from '../../utils/fileUtils';
import { OFFICE_CONVERSION_NOT_AVAILABLE } from '../../services/converter/DocConverter';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.DOCUMENT_CONVERTER>;

const CONVERSIONS = [
  { key: 'word-pdf', label: 'Word → PDF', description: 'Convert DOCX files to PDF' },
  { key: 'pdf-word', label: 'PDF → Word', description: 'Convert PDF to editable DOCX' },
  { key: 'img-pdf', label: 'Image → PDF', description: 'Convert JPG/PNG to PDF' },
  { key: 'pdf-ppt', label: 'PDF → PowerPoint', description: 'Convert PDF to PPTX' },
  { key: 'pdf-excel', label: 'PDF → Excel', description: 'Convert PDF to spreadsheet' },
] as const;

export default function ConverterScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [conversion, setConversion] = useState<typeof CONVERSIONS[number]['key']>('word-pdf');
  const { pickDocumentFromFiles } = useFilePicker();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickDocumentFromFiles();
      if (file) setPicked(file);
    } finally {
      setBusy(false);
    }
  }

  function convert() {
    if (!picked) return;
    Alert.alert(
      'Conversion not available offline',
      OFFICE_CONVERSION_NOT_AVAILABLE,
      [
        {
          text: 'Share original file',
          onPress: () => shareLocalFile({
            path: picked.uri,
            mime: mimeFromFilename(picked.name),
            title: picked.name,
          }).catch(() => {}),
        },
        { text: 'OK', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Document Converter"
      subtitle="Convert between file formats"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={picked ? 'Share original file' : 'Select a file first'}
          onPress={convert}
          disabled={!picked}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message="Loading…" />

      <PickerCard
        label="Select a document"
        hint="PDF, Word, PowerPoint, Excel or image"
        onPress={() => pickFile().catch(() => {})}
        fileName={picked?.name}
        fileSize={picked?.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
        busy={busy}
      />

      <SectionLabel text="Conversion type" />
      <View style={{ gap: spacing.sm }}>
        {CONVERSIONS.map(c => (
          <OptionRow
            key={c.key}
            label={c.label}
            description={c.description}
            selected={conversion === c.key}
            onPress={() => setConversion(c.key)}
          />
        ))}
      </View>

      <InfoBox
        icon="⚡"
        text="SwiftDocs works 100% offline — no files are ever uploaded. Full conversion support is coming in a future update. For now, use Share to open your file in another app."
      />
    </ToolShell>
  );
}
