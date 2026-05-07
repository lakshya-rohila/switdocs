import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Icon } from '../../components/common/Icon';
import { useModal } from '../../components/common/AppModal';
import { useTabBarBottomPadding } from '../../navigation/MainTabsNavigator';

import { AppHeader } from '../../components/common/AppHeader';
import { ROUTES } from '../../navigation/routes';
import type { SettingsStackParamList } from '../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../hooks/typedHooks';
import { settingsActions } from '../../store/slices/settingsSlice';
import { recentFilesActions } from '../../store/slices/recentFilesSlice';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shareText } from '../../utils/shareOpen';
import { openPrivacyPolicy, openTermsOfService } from '../../utils/webLinks';
import RNFS from 'react-native-fs';
import { showToast } from '../../utils/toast';

type Props = NativeStackScreenProps<SettingsStackParamList, typeof ROUTES.SETTINGS>;

export default function SettingsScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const { typography, colors } = useAppTheme();
  const tabBarPadding = useTabBarBottomPadding();
  const showModal = useModal();

  function confirmClearRecentFiles() {
    showModal({
      title: 'Clear recent files?',
      message: 'All recent file history will be removed. This cannot be undone.',
      buttons: [
        {
          label: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(recentFilesActions.clearRecent());
            showToast.success('Cleared', 'Recent files removed.');
          },
        },
        { label: 'Cancel', style: 'cancel' },
      ],
    });
  }

  function confirmClearCache() {
    showModal({
      title: 'Clear cache?',
      message: 'Temporary files created by SwiftDocs will be deleted.',
      buttons: [
        {
          label: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
              for (const f of files) {
                if (
                  f.name.includes('swiftdocs') ||
                  f.name.includes('signature') ||
                  f.name.includes('SwiftDocs')
                ) {
                  await RNFS.unlink(f.path).catch(() => {});
                }
              }
              showToast.success('Cache cleared', 'Temp files removed.');
            } catch {
              showToast.error('Error', 'Could not clear cache.');
            }
          },
        },
        { label: 'Cancel', style: 'cancel' },
      ],
    });
  }

  function shareApp() {
    shareText({
      title: 'SwiftDocs',
      message:
        'Check out SwiftDocs — every document tool, zero ads, always free! https://lakshya-rohila.github.io/switdocs',
    }).catch(() => {});
  }

  function rateApp() {
    showModal({
      title: 'Enjoying SwiftDocs?',
      message: 'Your review means a lot. Find us on the App Store or Google Play.',
      buttons: [
        { label: 'Open App Store', onPress: () => {} },
        { label: 'Not now', style: 'cancel' },
      ],
    });
  }

  function openPrivacy() {
    openPrivacyPolicy();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader variant="inner" title="Settings" navigation={navigation} />
      <ScrollView
        contentContainerStyle={[styles.sheet, { paddingBottom: tabBarPadding + spacing.md }]}
      >

        {/* Auto-save */}
        <Section title="Files">
          <RowSwitch
            label="Auto-save to Downloads"
            description="Automatically save processed files to your Downloads folder"
            value={settings.autoSaveConvertedFiles}
            onValueChange={v => dispatch(settingsActions.setAutoSaveConvertedFiles(v))}
          />
        </Section>

        {/* Storage */}
        <Section title="Storage">
          <RowAction
            label="Clear recent files"
            icon="clock"
            onPress={confirmClearRecentFiles}
            danger
          />
          <RowAction
            label="Clear cache"
            icon="trash-2"
            onPress={confirmClearCache}
            danger
          />
        </Section>

        {/* About */}
        <Section title="About">
          <RowAction label="Privacy Policy"    icon="shield"       onPress={openPrivacy} />
          <RowAction label="Rate SwiftDocs"    icon="star"         onPress={rateApp} />
          <RowAction label="Share SwiftDocs"   icon="share-2"      onPress={shareApp} />
          <View style={[styles.versionRow, { borderTopColor: colors.border }]}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Every doc tool. Always free.
            </Text>
          </View>
        </Section>

      </ScrollView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  const { typography, colors } = useAppTheme();
  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text
        style={[
          typography.caption,
          {
            color: colors.textSecondary,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: spacing.sm,
          },
        ]}
      >
        {title}
      </Text>
      <View style={{ gap: spacing.md }}>{children}</View>
    </View>
  );
}

function RowAction({
  label,
  icon,
  onPress,
  danger,
}: {
  label: string;
  icon?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { typography, colors } = useAppTheme();
  const color = danger ? '#DC2626' : colors.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ paddingVertical: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
    >
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Text style={[typography.bodyLarge, { color, flex: 1 }]}>{label}</Text>
      {!danger && <Icon name="chevron-right" size={16} color={colors.textSecondary} />}
    </Pressable>
  );
}

function RowSwitch({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { typography, colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
        {description ? (
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: '#2563EB' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  section: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  versionRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    gap: spacing.xxs,
  },
});
