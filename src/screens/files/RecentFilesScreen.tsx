import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/common/Icon';
import { useModal } from '../../components/common/AppModal';
import { useTabBarBottomPadding } from '../../navigation/MainTabsNavigator';
import { ROUTES } from '../../navigation/routes';
import type { RecentStackParamList } from '../../types/navigation';
import { AppHeader } from '../../components/common/AppHeader';
import { Segmented } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { FileRecord } from '../../types/file';
import { formatBytes } from '../../utils/formatBytes';
import { useAppSelector, useAppDispatch } from '../../hooks/typedHooks';
import { recentFilesActions } from '../../store/slices/recentFilesSlice';
import { shareLocalFile } from '../../utils/shareOpen';

type Props = NativeStackScreenProps<RecentStackParamList, typeof ROUTES.RECENT_FILES>;

const FILTERS = ['All', 'PDF', 'Images'] as const;

const FORMAT_ICON_NAMES: Record<string, string> = {
  pdf: 'file-text',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  svg: 'image',
  docx: 'file',
  xlsx: 'grid',
  pptx: 'monitor',
  txt: 'align-left',
};

const FORMAT_ICON_COLORS: Record<string, string> = {
  pdf: '#DC2626',
  png: '#7C3AED',
  jpg: '#7C3AED',
  jpeg: '#7C3AED',
  webp: '#0D9488',
  docx: '#2563EB',
  xlsx: '#16A34A',
  pptx: '#EA580C',
  txt: '#64748B',
  svg: '#7C3AED',
};

function iconNameForFile(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return FORMAT_ICON_NAMES[ext] ?? 'file';
}

function iconColorForFile(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return FORMAT_ICON_COLORS[ext] ?? '#64748B';
}

export default function RecentFilesScreen({ navigation }: Props) {
  const { typography, colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const tabBarPadding = useTabBarBottomPadding();
  const showModal = useModal();
  const reduxFiles = useAppSelector(state => state.recentFiles.items);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const visible = useMemo(() => filterRows(reduxFiles, filter), [reduxFiles, filter]);

  function openFileMenu(item: FileRecord) {
    showModal({
      title: item.name,
      message: item.sizeBytes ? formatBytes(item.sizeBytes) : 'Select an action',
      buttons: [
        {
          label: 'Share file',
          onPress: () =>
            shareLocalFile({
              path: item.uri,
              mime: item.mimeType ?? 'application/octet-stream',
              title: item.name,
            }).catch(() => {}),
        },
        {
          label: 'Remove from list',
          style: 'destructive',
          onPress: () => dispatch(recentFilesActions.removeRecent(item.id)),
        },
        { label: 'Cancel', style: 'cancel' },
      ],
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader variant="inner" title="Recent Files" navigation={navigation} />

      <View style={{ paddingHorizontal: spacing.screenHorizontal, paddingVertical: spacing.sm }}>
        <Segmented items={[...FILTERS]} value={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={visible}
        ListEmptyComponent={
          <EmptyState
            title="No files yet"
            subtitle="Every file you save or export will appear here automatically."
            actionLabel="Go to tools"
            onActionPress={() => navigation.getParent()?.navigate(ROUTES.TAB_HOME as never)}
          />
        }
        contentContainerStyle={{ paddingBottom: tabBarPadding + spacing.md, flexGrow: 1 }}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: spacing.screenHorizontal + 52 }} />
        )}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => openFileMenu(item)}
            style={[styles.row, { backgroundColor: colors.surface }]}
          >
            {/* File type icon */}
            <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
              <Icon name={iconNameForFile(item.name)} size={22} color={iconColorForFile(item.name)} />
            </View>

            {/* File info */}
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[typography.label, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {item.sizeBytes ? `${formatBytes(item.sizeBytes)} · ` : ''}
                {formatRelativeTime(item.modifiedAt)}
              </Text>
            </View>

            {/* Action arrow */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="File options"
              hitSlop={12}
              onPress={() => openFileMenu(item)}
            >
              <Icon name="more-horizontal" size={20} color={colors.textSecondary} />
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

function filterRows(items: FileRecord[], filter: string) {
  if (filter === 'All') return items;
  if (filter === 'PDF') return items.filter(item => item.name.toLowerCase().endsWith('.pdf'));
  return items.filter(item => /\.(png|jpg|jpeg|webp|svg)$/i.test(item.name));
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm + 2,
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
