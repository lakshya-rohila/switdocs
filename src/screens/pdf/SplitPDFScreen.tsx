import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, OptionRow, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { splitPdf, type SplitMode } from '../../services/pdf/PDFSplitter';
import { showToast } from '../../utils/toast';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.SPLIT_PDF>;

const MODES = [
  { key: 'range' as SplitMode, label: 'By page range', description: 'e.g. pages 1–5, 10–15' },
  { key: 'extract' as SplitMode, label: 'Extract single pages', description: 'e.g. pages 2, 4, 7' },
  { key: 'every' as SplitMode, label: 'Every N pages', description: 'Split into equal chunks' },
];

export default function SplitPDFScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [mode, setMode] = useState<SplitMode>('range');
  const [rangeText, setRangeText] = useState('');
  const [done, setDone] = useState(false);
  const { pickDocumentFromFiles } = useFilePicker();
  const showModal = useModal();

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickDocumentFromFiles();
      if (file) { setPicked(file); setDone(false); }
    } finally {
      setBusy(false);
    }
  }

  async function split() {
    if (!picked) return;
    if (!rangeText.trim()) {
      showModal({
        title: 'Enter page numbers',
        message: mode === 'every' ? 'Enter the number of pages per chunk.' : 'Enter the page numbers or ranges to split.',
        buttons: [{ label: 'OK', style: 'cancel' }],
      });
      return;
    }
    setBusy(true);
    try {
      const result = await splitPdf(picked.uri, mode, rangeText);
      setDone(true);
      showToast.success(
        'PDF split!',
        `Created ${result.paths.length} file${result.paths.length !== 1 ? 's' : ''} — saved to Downloads.`,
      );
    } catch (e) {
      showModal({
        title: 'Split failed',
        message: e instanceof Error ? e.message : 'Could not split PDF.',
        buttons: [{ label: 'OK', style: 'cancel' }],
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      title="Split PDF"
      subtitle="Divide a PDF into parts"
      navigation={navigation}
      bottomBar={
        <BigButton label={done ? 'Split again' : 'Split PDF'} onPress={() => split().catch(() => {})} disabled={!picked || busy} loading={busy} />
      }
    >
      <ProgressOverlay visible={busy} message="Splitting PDF…" />

      <PickerCard
        label="Select a PDF file"
        hint="Tap here to browse your files"
        onPress={() => pickFile().catch(() => {})}
        fileName={picked?.name}
        fileSize={picked?.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
        busy={busy}
      />

      <SectionLabel text="Split method" />
      <View style={{ gap: spacing.sm }}>
        {MODES.map(m => (
          <OptionRow
            key={m.key}
            label={m.label}
            description={m.description}
            selected={mode === m.key}
            onPress={() => setMode(m.key)}
          />
        ))}
      </View>

      {picked ? (
        <>
          <SectionLabel text={mode === 'every' ? 'Pages per chunk' : 'Page numbers'} />
          <TextInput
            value={rangeText}
            onChangeText={setRangeText}
            placeholder={mode === 'range' ? '1-3, 5-8' : mode === 'extract' ? '2, 4, 7' : '5'}
            placeholderTextColor={colors.textSecondary}
            keyboardType="numbers-and-punctuation"
            style={{
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing.md,
              fontSize: 16,
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }}
          />
        </>
      ) : null}

      {done ? (
        <InfoBox icon="check-circle" text="PDF split and saved to your Downloads folder." />
      ) : (
        <InfoBox icon="scissors" text="Split a large PDF into smaller parts for easy sharing or filing." />
      )}
    </ToolShell>
  );
}
