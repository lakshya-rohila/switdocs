import type { PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import type { ResolvedThemeColors } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTabBarBottomPadding } from '../../navigation/MainTabsNavigator';

export function ScrollScreen({
  title,
  navigation,
  right,
  children,
}: PropsWithChildren<{
  title: string;
  navigation: NavigationProp<Record<string, object | undefined>>;
  right?: ReactElement;
}>): ReactElement {
  const { colors } = useAppTheme();
  const tabBarPadding = useTabBarBottomPadding();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AppHeader variant="inner" title={title} navigation={navigation} right={right} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.pad, gutter(colors), { paddingBottom: tabBarPadding + spacing.md }]}>
        {children}
      </ScrollView>
    </View>
  );
}

function gutter(_colors: ResolvedThemeColors) {
  return { paddingHorizontal: spacing.screenHorizontal, rowGap: spacing.md, paddingBottom: spacing.xxxl };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pad: {
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
});
