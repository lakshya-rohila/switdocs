import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  openPrivacyPolicy,
  openTermsOfService,
  openAbout,
  openSupport,
  openSupportEmail,
} from '../utils/webLinks';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  onPress,
  showArrow = true,
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsItemContent}>
      <Text style={styles.settingsItemTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && <Text style={styles.arrow}>›</Text>}
  </TouchableOpacity>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <SettingsSection title="About">
          <SettingsItem
            title="About SwiftDocs"
            subtitle="Learn more about the app"
            onPress={openAbout}
          />
          <SettingsItem
            title="Version"
            subtitle="1.0.0"
            onPress={() => {}}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            title="Help & FAQ"
            subtitle="Get help and find answers"
            onPress={openSupport}
          />
          <SettingsItem
            title="Contact Support"
            subtitle="lakshyarohila21@gmail.com"
            onPress={openSupportEmail}
          />
        </SettingsSection>

        <SettingsSection title="Legal">
          <SettingsItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={openPrivacyPolicy}
          />
          <SettingsItem
            title="Terms of Service"
            subtitle="Terms and conditions"
            onPress={openTermsOfService}
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Swift<Text style={styles.accent}>Docs</Text>
          </Text>
          <Text style={styles.footerSubtext}>
            Every doc tool. Zero ads. Always free.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  arrow: {
    fontSize: 24,
    color: '#CBD5E1',
    fontWeight: '300',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
  },
  footerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  accent: {
    color: '#2563EB',
  },
  footerSubtext: {
    fontSize: 13,
    color: '#64748B',
  },
});
