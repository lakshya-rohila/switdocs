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

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.ROTATE_PDF>;

const ROTATIONS = [
  { key: '90cw', label: 'Rotate 90° clockwise', description: 'Turn pages to the right' },
  { key: '90ccw', label: 'Rotate 90° counter-clockwise', description: 'Turn pages to the left' },
  { key: '180', label: 'Rotate 180°', description: 'Flip pages upside down' },
] as const;

export default function RotatePDFScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [rotation, setRotation] = useState<'90cw' | '90ccw' | '180'>('90cw');
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

  function rotate() {
    if (!picked) return;
    Alert.alert(
      'Not available offline',
      'PDF rotation requires a native engine not included in this build. You can share the original file.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: 'application/pdf', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Rotate Pages"
      subtitle="Fix page orientation"
      navigation={navigation}
      bottomBar={
        <BigButton label="Apply rotation" onPress={rotate} disabled={!picked} loading={busy} />
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

      <SectionLabel text="Rotation direction" />
      <View style={{ gap: spacing.sm }}>
        {ROTATIONS.map(r => (
          <OptionRow
            key={r.key}
            label={r.label}
            description={r.description}
            selected={rotation === r.key}
            onPress={() => setRotation(r.key)}
          />
        ))}
      </View>

      <InfoBox icon="rotate-cw" text="Rotation applies to all pages. Rotates clockwise or counter-clockwise by the selected amount." />
    </ToolShell>
  );
}
