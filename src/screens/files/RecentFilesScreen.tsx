import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '../../navigation/routes';
import type { RecentStackParamList } from '../../types/navigation';
import { AppHeader } from '../../components/common/AppHeader';
import { Segmented } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import type { FileRecord } from '../../types/file';
import { formatBytes } from '../../utils/formatBytes';
import { useAppSelector } from '../../hooks/typedHooks';

type Props = NativeStackScreenProps<RecentStackParamList, typeof ROUTES.RECENT_FILES>;

const FILTERS = ['All', 'PDF', 'DOCX', 'Images'] as const;

export default function RecentFilesScreen({ navigation }: Props) {
  const { typography, colors } = useAppTheme();
  const reduxFiles = useAppSelector(state => state.recentFiles.items);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const visible = useMemo(() => filterRows(reduxFiles, filter), [reduxFiles, filter]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader variant="inner" title="Recent files" navigation={navigation} />
      <View style={{ paddingHorizontal: spacing.screenHorizontal, gap: spacing.sm }}>
        <Segmented items={[...FILTERS]} value={filter} onChange={setFilter} />
        <SortRow />
      </View>
      <FlatList
        data={visible}
        ListEmptyComponent={
          <EmptyState
            title="No recent files yet"
            subtitle="Every export auto-pins itself here."
            actionLabel="Open a tool"
            onActionPress={() => navigation.getParent()?.navigate(ROUTES.TAB_HOME as never)}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.xxxl, flexGrow: 1 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              { borderBottomColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[typography.label]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[typography.caption]}>
                {formatBytes(item.sizeBytes)} · {new Date(item.modifiedAt).toLocaleString()}
              </Text>
            </View>
            <Pressable accessibilityRole="button" hitSlop={12}>
              <Text style={[typography.h3]}>⋮</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

function SortRow() {
  const { typography, colors } = useAppTheme();
  return (
    <Pressable accessibilityRole="button" style={[styles.row, { gap: spacing.xs }]}>
      <Text style={[typography.caption, { color: colors.primary }]}>Sort by:</Text>
      <Text style={[typography.label]}>Date descending</Text>
    </Pressable>
  );
}

function filterRows(items: FileRecord[], filter: string) {
  if (filter === 'All') return items;
  if (filter === 'PDF') return items.filter(item => item.name.toLowerCase().endsWith('.pdf'));
  if (filter === 'DOCX') return items.filter(item => item.name.toLowerCase().endsWith('.docx'));
  return items.filter(item => /\.(png|jpg|jpeg|webp)$/i.test(item.name));
}



const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
