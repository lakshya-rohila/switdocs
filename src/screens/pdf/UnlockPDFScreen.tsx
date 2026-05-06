import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.UNLOCK_PDF>;

export default function UnlockPDFScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [password, setPassword] = useState('');
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

  function unlock() {
    if (!picked || !password) return;
    Alert.alert(
      'Not available offline',
      'PDF unlocking requires a native engine not included in this build. You can share the original file.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked.uri, mime: 'application/pdf', title: picked.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Unlock PDF"
      subtitle="Remove password protection"
      navigation={navigation}
      bottomBar={
        <BigButton label="Unlock PDF" onPress={unlock} disabled={!picked || !password} loading={busy} />
      }
    >
      <ProgressOverlay visible={busy} message="Loading…" />

      <PickerCard
        label="Select a protected PDF"
        hint="Tap here to browse your files"
        onPress={() => pickFile().catch(() => {})}
        fileName={picked?.name}
        fileSize={picked?.size != null ? `${(picked.size / 1024).toFixed(0)} KB` : undefined}
        busy={busy}
      />

      <SectionLabel text="PDF password" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter the PDF password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 16, color: colors.textPrimary, backgroundColor: colors.surface }}
      />

      <InfoBox icon="unlock" text="Enter the password that was used to lock this PDF to remove the protection." />
    </ToolShell>
  );
}
