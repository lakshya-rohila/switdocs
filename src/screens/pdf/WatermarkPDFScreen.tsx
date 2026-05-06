import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Switch, Text, TextInput, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.WATERMARK_PDF>;

export default function WatermarkPDFScreen({ navigation }: Props) {
  const { colors, typography } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [diagonal, setDiagonal] = useState(true);
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

  function apply() {
    if (!picked) return;
    if (!watermarkText.trim()) {
      Alert.alert('Enter watermark text', 'Type the text you want to stamp on the PDF.');
      return;
    }
    Alert.alert(
      'Not available offline',
      'PDF watermarking requires a native engine not included in this build. You can share the original file.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: 'application/pdf', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Watermark PDF"
      subtitle="Stamp text on every page"
      navigation={navigation}
      bottomBar={
        <BigButton label="Apply watermark" onPress={apply} disabled={!picked} loading={busy} />
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

      <SectionLabel text="Watermark text" />
      <TextInput
        value={watermarkText}
        onChangeText={setWatermarkText}
        placeholder="e.g. CONFIDENTIAL, DRAFT"
        placeholderTextColor={colors.textSecondary}
        maxLength={40}
        style={{
          borderWidth: 1.5,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
          fontSize: 16,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
          fontWeight: '600',
          letterSpacing: 1,
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs }}>
        <View>
          <Text style={[typography.label, { color: colors.textPrimary }]}>Diagonal placement</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Stamp at an angle across the page</Text>
        </View>
        <Switch value={diagonal} onValueChange={setDiagonal} />
      </View>

      <InfoBox icon="💧" text="The watermark text appears semi-transparent on every page of the PDF." />
    </ToolShell>
  );
}
