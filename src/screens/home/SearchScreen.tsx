import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ROUTES } from '../../navigation/routes';
import { HOME_TOOL_SECTIONS } from '../../constants/tools';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { ToolCardCompact } from '../../components/common/ToolCard';
import type { HomeStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.SEARCH>;

const ALL_TOOLS = HOME_TOOL_SECTIONS.flatMap(section => section.items).filter(
  (item, index, self) => index === self.findIndex(t => t.id === item.id),
);

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ALL_TOOLS;
    return ALL_TOOLS.filter(tool => tool.title.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <AppHeader variant="inner" title="Search tools" navigation={navigation} />
      <View style={styles.inputRow}>
        <TextInput
          autoFocus
          placeholder="Search tools…"
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        {!query.trim() ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.help}>Popular searches</Text>
            <View style={styles.chipRow}>
              {[...new Set(['E‑Signature', 'Compress PDF', 'Convert'])].map(label => (
                <Pressable
                  accessibilityRole="button"
                  key={label}
                  onPress={() =>
                    setQuery(label.replace(/\u2009/gu, '').replace(/\s+/g, ' '))
                  }
                  style={styles.chip}
                >
                  <Text style={styles.chipText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>
      <FlatList
        data={results}
        keyExtractor={item => `${item.id}-${item.title}`}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title={`No tools found for '${query.trim()}'`}
            subtitle="Try abbreviations (“PDF”), categories, or feature names (“merge”)."
            actionLabel="Clear query"
            onActionPress={() => setQuery('')}
          />
        }
        renderItem={({ item }) => (
          <ToolCardCompact
            title={item.title}
            abbreviation={item.abbreviation}
            iconBackground={item.iconBg}
            navigation={navigation as never}
            route={item.route}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#F8FAFC',
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    fontSize: 16,
    color: '#0F172A',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DBEAFE',
  },
  help: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
});
