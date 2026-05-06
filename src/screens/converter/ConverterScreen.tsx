import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import {
  ToolShell,
  PickerCard,
  BigButton,
  InfoBox,
  OptionRow,
  SectionLabel,
} from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';
import { mimeFromFilename } from '../../utils/fileUtils';
import { imagesToPdf } from '../../services/converter/ImageProcessor';
import { showToast } from '../../utils/toast';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.DOCUMENT_CONVERTER>;

type ConversionKey = 'img-pdf' | 'word-pdf' | 'pdf-word' | 'pdf-ppt' | 'pdf-excel';

const CONVERSIONS: { key: ConversionKey; label: string; description: string; works: boolean }[] = [
  { key: 'img-pdf', label: 'Image → PDF', description: 'Convert JPG/PNG to a PDF file — works on-device', works: true },
  { key: 'word-pdf', label: 'Word → PDF', description: 'Requires a conversion engine (coming soon)', works: false },
  { key: 'pdf-word', label: 'PDF → Word', description: 'Requires a conversion engine (coming soon)', works: false },
  { key: 'pdf-ppt', label: 'PDF → PowerPoint', description: 'Requires a conversion engine (coming soon)', works: false },
  { key: 'pdf-excel', label: 'PDF → Excel', description: 'Requires a conversion engine (coming soon)', works: false },
];

export default function ConverterScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [conversion, setConversion] = useState<ConversionKey>('img-pdf');
  const [done, setDone] = useState(false);
  const { pickImageFromFiles, pickDocumentFromFiles } = useFilePicker();

  const selectedConversion = CONVERSIONS.find(c => c.key === conversion)!;

  async function pickFile() {
    setBusy(true);
    try {
      let file: PickedFile | null = null;
      if (conversion === 'img-pdf') {
        file = await pickImageFromFiles();
      } else {
        file = await pickDocumentFromFiles();
      }
      if (file) { setPicked(file); setDone(false); }
    } finally {
      setBusy(false);
    }
  }

  async function runConversion() {
    if (!picked) return;

    if (!selectedConversion.works) {
      Alert.alert(
        'Not available yet',
        `${selectedConversion.label} conversion requires a native engine not included in this build.\n\nYou can share the original file to another app that supports this conversion.`,
        [
          {
            text: 'Share original file',
            onPress: () =>
              shareLocalFile({ path: picked.uri, mime: mimeFromFilename(picked.name), title: picked.name }).catch(() => {}),
          },
          { text: 'OK', style: 'cancel' },
        ],
      );
      return;
    }

    // Image → PDF — this actually works!
    setBusy(true);
    try {
      const title = picked.name.replace(/\.[^.]+$/, '') || 'Image';
      await imagesToPdf([picked.uri], title);
      setDone(true);
      showToast.success('PDF created!', 'Saved to your Downloads folder.');
    } catch (e) {
      Alert.alert('Conversion failed', e instanceof Error ? e.message : 'Could not convert image to PDF.');
    } finally {
      setBusy(false);
    }
  }

  const btnLabel = busy
    ? 'Converting…'
    : !selectedConversion.works
    ? 'Share original file'
    : done
    ? 'Convert again'
    : 'Convert now';

  return (
    <ToolShell
      title="Document Converter"
      subtitle="Convert between file formats"
      navigation={navigation}
      bottomBar={
        <BigButton
          label={btnLabel}
          onPress={() => runConversion().catch(() => {})}
          disabled={!picked || busy}
          loading={busy}
        />
      }
    >
      <ProgressOverlay visible={busy} message="Converting…" />

      <SectionLabel text="Conversion type" />
      <View style={{ gap: spacing.sm }}>
        {CONVERSIONS.map(c => (
          <OptionRow
            key={c.key}
            label={c.label}
            description={c.description}
            selected={conversion === c.key}
            onPress={() => { setConversion(c.key); setPicked(null); setDone(false); }}
          />
        ))}
      </View>

      <SectionLabel text="Select file" />
      <PickerCard
        label={conversion === 'img-pdf' ? 'Select an image' : 'Select a document'}
        hint={conversion === 'img-pdf' ? 'JPG or PNG' : 'PDF, Word, PowerPoint…'}
        onPress={() => pickFile().catch(() => {})}
        fileName={picked?.name}
        fileSize={picked?.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
        busy={busy}
      />

      {done ? (
        <InfoBox icon="check-circle" text="PDF created and saved to your Downloads folder." />
      ) : selectedConversion.works ? (
        <InfoBox icon="zap" text="Image → PDF works fully on-device. No internet needed — your file never leaves your phone." />
      ) : (
        <InfoBox icon="info" text="This conversion type is coming soon. For now, you can share the original file to another app that supports it." />
      )}
    </ToolShell>
  );
}
