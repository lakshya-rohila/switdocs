import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { HOME_TOOL_SECTIONS } from '../../constants/tools';
import { AppHeader } from '../../components/common/AppHeader';
import { ToolCardGridItem } from '../../components/common/ToolCard';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useTabBarBottomPadding } from '../../navigation/MainTabsNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.HOME>;

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const tabBarPadding = useTabBarBottomPadding();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarPadding + spacing.md }]}
      >
        {HOME_TOOL_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
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

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl + spacing.lg,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: spacing.screenHorizontal,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal - 6,
    rowGap: spacing.md,
  },
});
