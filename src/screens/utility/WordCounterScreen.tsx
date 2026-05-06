import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from '../../components/common/Icon';

import { AppHeader } from '../../components/common/AppHeader';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker } from '../../hooks/useFilePicker';
import RNFS from 'react-native-fs';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.WORD_COUNTER>;

export default function WordCounterScreen({ navigation }: Props) {
  const [source, setSource] = useState('');
  const stats = useMemo(() => tally(source), [source]);
  const { typography, colors } = useAppTheme();
  const { pickDocumentFromFiles } = useFilePicker();

  async function importFromFiles() {
    try {
      const file = await pickDocumentFromFiles();
      if (!file) return;
      // Try reading as text (works for plain text files)
      try {
        const text = await RNFS.readFile(file.uri, 'utf8');
        setSource(text);
      } catch {
        Alert.alert('Cannot read file', 'Only plain text (.txt) files can be imported for word counting.');
      }
    } catch {
      // user cancelled
    }
  }

  const entries = Object.entries(stats);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader
        variant="inner"
        title="Word Counter"
        navigation={navigation}
        right={
          <Pressable accessibilityRole="button" onPress={() => setSource('')} hitSlop={12}>
            <Text style={[typography.button, { color: colors.primary }]}>Clear</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.sheet} keyboardShouldPersistTaps="handled">
        <TextInput
          multiline
          value={source}
          onChangeText={setSource}
          placeholderTextColor={colors.textSecondary}
          placeholder="Type or paste your text here…"
          style={[
            typography.bodyLarge,
            {
              minHeight: 180,
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: spacing.md,
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              textAlignVertical: 'top',
            },
          ]}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => importFromFiles().catch(() => {})}
          style={[styles.importBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Icon name="folder" size={20} color={colors.primary} />
          <Text style={[typography.label, { color: colors.primary }]}>Import from Files</Text>
        </Pressable>

        {source.length > 0 ? (
          <View style={styles.grid}>
            {entries.map(([label, metric]) => (
              <MetricCard key={label} label={label} value={`${metric}`} />
            ))}
          </View>
        ) : (
          <View style={[styles.emptyHint, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
            <Icon name="edit-3" size={36} color={colors.primary} />
            <Text style={[typography.bodyLarge, { color: colors.textSecondary, textAlign: 'center' }]}>
              Start typing above to see{'\n'}your word count and stats
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  const { typography, colors } = useAppTheme();
  return (
    <View style={[styles.metric, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function tally(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const stripped = text.replace(/\s+/g, '');
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n+/).filter(Boolean).length;
  const minutes = words > 0 ? Math.max(1, Math.round(words / 200)) : 0;
  return {
    Words: words,
    Characters: chars,
    'No spaces': stripped.length,
    Sentences: sentences,
    Paragraphs: paragraphs,
    'Read time': minutes > 0 ? `${minutes} min` : '—',
  };
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    columnGap: spacing.sm,
  },
  metric: {
    flexBasis: '48%',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xxs,
  },
  emptyHint: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
});
