import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStackNavigator from './HomeStack';
import RecentStackNavigator from './RecentStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import { ROUTES } from './routes';
import type { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Height of the floating bar card itself */
export const TAB_BAR_HEIGHT = 64;

/**
 * Hook that returns the total bottom space consumed by the floating tab bar.
 * Use this as paddingBottom on any scrollable screen inside the tab navigator.
 */
export function useTabBarBottomPadding() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 12) + 8;
}

// ─── SVG Icon components ──────────────────────────────────────────────────────

const STROKE = 1.6;
const SIZE = 26;

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M9 21V12h6v9"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RecentIcon({ color }: { color: string }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={STROKE} />
      <Path
        d="M12 7v5l3.5 2"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={STROKE} />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        strokeWidth={STROKE}
      />
    </Svg>
  );
}

// ─── Tab bar config ───────────────────────────────────────────────────────────

const TAB_ITEMS = [
  { route: ROUTES.TAB_HOME,     label: 'Home',     Icon: HomeIcon },
  { route: ROUTES.TAB_RECENT,   label: 'Recent',   Icon: RecentIcon },
  { route: ROUTES.TAB_SETTINGS, label: 'Settings', Icon: SettingsIcon },
] as const;

// ─── Custom floating tab bar ──────────────────────────────────────────────────

const ACTIVE_COLOR = '#2563EB';
const INACTIVE_COLOR = '#94A3B8';
const BAR_H = 64;

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barWrap,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const item = TAB_ITEMS[index];
          if (!item) return null;
          const focused = state.index === index;
          const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.tabItem}
            >
              {/* Active indicator — pill above icon */}
              <View style={styles.indicatorSlot}>
                {focused && <View style={styles.indicator} />}
              </View>

              {/* Icon */}
              <item.Icon color={color} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────

function renderTabBar(props: BottomTabBarProps) {
  return <FloatingTabBar {...props} />;
}

export default function MainTabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={ROUTES.TAB_HOME}     component={HomeStackNavigator} />
      <Tab.Screen name={ROUTES.TAB_RECENT}   component={RecentStackNavigator} />
      <Tab.Screen name={ROUTES.TAB_SETTINGS} component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  barWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_H,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(226,232,240,0.8)',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingVertical: 4,
  },
  indicatorSlot: {
    height: 3,
    width: 32,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: 3,
    width: 32,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
  },
});
