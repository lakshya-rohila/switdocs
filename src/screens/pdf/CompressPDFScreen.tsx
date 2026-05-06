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

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.COMPRESS_PDF>;

const LEVELS = [
  { key: 'low', label: 'Light compression', description: 'Best quality · reduces size by ~35%' },
  { key: 'medium', label: 'Medium compression', description: 'Good quality · reduces size by ~60%' },
  { key: 'high', label: 'Maximum compression', description: 'Smallest file · quality may drop' },
] as const;

export default function CompressPDFScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
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

  function compress() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'PDF compression requires a native engine not included in this build. You can share the original file.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: 'application/pdf', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Compress PDF"
      subtitle="Reduce file size"
      navigation={navigation}
      bottomBar={
        <BigButton label="Compress PDF" onPress={compress} disabled={!picked} loading={busy} />
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

      <InfoBox icon="info" text="Compression reduces file size while keeping content readable. Higher compression means smaller files but lower image quality." />
    </ToolShell>
  );
}
