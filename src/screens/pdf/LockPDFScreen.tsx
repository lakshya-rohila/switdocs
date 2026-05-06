import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { ToolShell, PickerCard, BigButton, InfoBox, SectionLabel } from '../../components/common/ToolShell';
import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker, type PickedFile } from '../../hooks/useFilePicker';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.LOCK_PDF>;

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#E2E8F0' };
  let score = Math.min(pw.length * 6, 50);
  if (/[A-Z]/.test(pw)) score += 15;
  if (/[0-9]/.test(pw)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
  score = Math.min(score, 100);
  if (score < 30) return { score, label: 'Weak', color: '#DC2626' };
  if (score < 60) return { score, label: 'Fair', color: '#D97706' };
  if (score < 80) return { score, label: 'Good', color: '#2563EB' };
  return { score, label: 'Strong', color: '#16A34A' };
}

export default function LockPDFScreen({ navigation }: Props) {
  const { colors, typography } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { pickDocumentFromFiles } = useFilePicker();

  const strength = useMemo(() => passwordStrength(password), [password]);
  const mismatch = confirm.length > 0 && password !== confirm;
  const canLock = picked && password.length >= 4 && password === confirm;

  async function pickFile() {
    setBusy(true);
    try {
      const file = await pickDocumentFromFiles();
      if (file) setPicked(file);
    } finally {
      setBusy(false);
    }
  }

  function lock() {
    if (!canLock) return;
    Alert.alert(
      'Not available offline',
      'PDF encryption requires a native engine not included in this build. You can share the original file.',
      [
        { text: 'Share original', onPress: () => shareLocalFile({ path: picked!.uri, mime: 'application/pdf', title: picked!.name }).catch(() => {}) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  return (
    <ToolShell
      title="Lock PDF"
      subtitle="Protect with a password"
      navigation={navigation}
      bottomBar={
        <BigButton label="Lock PDF" onPress={lock} disabled={!canLock} loading={busy} />
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

      <SectionLabel text="Set a password" />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 16, color: colors.textPrimary, backgroundColor: colors.surface }}
      />

      {password.length > 0 && (
        <View style={{ gap: spacing.xs }}>
          <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 99 }}>
            <View style={{ height: '100%', width: `${strength.score}%` as `${number}%`, backgroundColor: strength.color, borderRadius: 99 }} />
          </View>
          <Text style={[typography.caption, { color: strength.color }]}>Password strength: {strength.label}</Text>
        </View>
      )}

      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        style={{ borderWidth: 1.5, borderColor: mismatch ? '#DC2626' : colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 16, color: colors.textPrimary, backgroundColor: colors.surface }}
      />
      {mismatch && <Text style={[typography.caption, { color: '#DC2626' }]}>Passwords don't match</Text>}

      <InfoBox icon="lock" text="The password will be required to open the PDF. Keep it somewhere safe — it cannot be recovered." />
    </ToolShell>
  );
}
