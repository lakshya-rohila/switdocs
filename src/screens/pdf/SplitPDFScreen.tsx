import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, OptionRow, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.SPLIT_PDF>;

const MODES = [
  { key: 'range', label: 'By page range', description: 'e.g. pages 1–5, 10–15' },
  { key: 'extract', label: 'Extract single pages', description: 'e.g. pages 2, 4, 7' },
  { key: 'every', label: 'Every N pages', description: 'Split into equal chunks' },
] as const;

export default function SplitPDFScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [mode, setMode] = useState<'range' | 'extract' | 'every'>('range');
  const [rangeText, setRangeText] = useState('');
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

  function split() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'PDF splitting requires a native engine not included in this build. You can share the original file.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: 'application/pdf', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Split PDF"
      subtitle="Divide a PDF into parts"
      navigation={navigation}
      bottomBar={
        <BigButton label="Split PDF" onPress={split} disabled={!picked} loading={busy} />
      }
    >
      <ProgressOverlay visible={busy} message="Loading…" />

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
            style={[{
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing.md,
              fontSize: 16,
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }]}
          />
        </>
      ) : null}

      <InfoBox icon="✂️" text="Split a large PDF into smaller parts for easy sharing or filing." />
    </ToolShell>
  );
}
