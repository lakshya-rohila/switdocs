import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { HOME_TOOL_SECTIONS, QUICK_ACTIONS } from '../../constants/tools';
import { AppHeader } from '../../components/common/AppHeader';
import { InlineSearchBar } from '../../components/common/AppHeader';
import { ToolCardGridItem } from '../../components/common/ToolCard';
import { spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.HOME>;

export default function HomeScreen({ navigation }: Props) {
  const openQuick = useCallback(
    (route: (typeof QUICK_ACTIONS)[number]['route']) => {
      navigation.navigate(route as never);
    },
    [navigation],
  );

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        onPressProfile={() =>
          navigation.getParent()?.navigate?.(ROUTES.TAB_SETTINGS as never)
        }
        onPressSearch={() => navigation.navigate(ROUTES.SEARCH)}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.paddingBottom}
      >
        <InlineSearchBar onPress={() => navigation.navigate(ROUTES.SEARCH)} />
        <SectionHeader eyebrow label="Quick actions" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroller}>
          {QUICK_ACTIONS.map(action => (
            <Pressable
              accessibilityRole="button"
              key={action.key}
              onPress={() => openQuick(action.route)}
              style={styles.quickChip}
            >
              <Text style={styles.quickText}>{action.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <SectionHeader label="All tools" />
        {HOME_TOOL_SECTIONS.map(section => (
          <View key={section.title} style={{ marginBottom: spacing.xl }}>
            <Text style={[styles.sectionLabel]}>{section.title}</Text>
            <View style={styles.grid}>
              {section.items.map(tool => (
                <ToolCardGridItem
                  key={tool.id}
                  title={tool.title}
                  abbreviation={tool.abbreviation}
                  iconBackground={tool.iconBg}
                  iconName={tool.iconName}
                  iconImage={tool.iconImage}
                  route={tool.route}
                  navigation={navigation as never}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function SectionHeader({ eyebrow, label }: { eyebrow?: boolean; label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={eyebrow ? styles.sectionEyebrow : styles.sectionEyebrowStrong}>{label}</Text>
      {eyebrow ? <Text style={styles.fakeLink}>Curated shortcuts</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  paddingBottom: {
    paddingBottom: spacing.xxxl + spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.screenHorizontal,
    marginTop: spacing.lg,
  },
  sectionEyebrow: {
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionEyebrowStrong: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.15,
  },
  fakeLink: {
    fontSize: 13,
    color: '#64748B',
  },
  quickScroller: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  quickChip: {
    marginHorizontal: spacing.xxs,
    paddingHorizontal: spacing.lg + 6,
    paddingVertical: spacing.md,
    borderRadius: spacing.xxl,
    backgroundColor: '#EFF6FF',
  },
  quickText: {
    fontWeight: '600',
    color: '#1E40AF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal - 6,
    marginTop: spacing.md,
    rowGap: spacing.md,
  },
  sectionLabel: {
    paddingHorizontal: spacing.screenHorizontal - 6,
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
});
