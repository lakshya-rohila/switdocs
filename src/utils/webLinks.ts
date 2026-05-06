import { Linking, Alert } from 'react-native';

// Your GitHub Pages URL
const BASE_URL = 'https://lakshya-rohila.github.io/switdocs';

export const WebLinks = {
  PRIVACY_POLICY: `${BASE_URL}/privacy-policy.html`,
  TERMS_OF_SERVICE: `${BASE_URL}/terms-of-service.html`,
  ABOUT: `${BASE_URL}/about.html`,
  SUPPORT: `${BASE_URL}/support.html`,
  HOME: BASE_URL,
};

/**
 * Open a URL in the device's default browser
 */
export const openURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn('Cannot open URL:', url);
      Alert.alert('Error', 'Unable to open this link. Please try again.');
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    Alert.alert('Error', 'Failed to open link. Please try again.');
  }
};

/**
 * Open Privacy Policy
 */
export const openPrivacyPolicy = () => openURL(WebLinks.PRIVACY_POLICY);

/**
 * Open Terms of Service
 */
export const openTermsOfService = () => openURL(WebLinks.TERMS_OF_SERVICE);

/**
 * Open About page
 */
export const openAbout = () => openURL(WebLinks.ABOUT);

/**
 * Open Support page
 */
export const openSupport = () => openURL(WebLinks.SUPPORT);

/**
 * Open home page
 */
export const openHomePage = () => openURL(WebLinks.HOME);

/**
 * Open support email
 */
export const openSupportEmail = async () => {
  const email = 'lakshyarohila21@gmail.com';
  const subject = 'SwiftDocs Support Request';
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  
  try {
    const supported = await Linking.canOpenURL(mailtoUrl);
    if (supported) {
      await Linking.openURL(mailtoUrl);
    } else {
      // Fallback: show alert with email if mailto isn't supported
      Alert.alert(
        'Contact Support',
        `Please email us at:\n${email}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Copy Email', 
            onPress: () => {
              // Note: You'll need to import Clipboard from '@react-native-clipboard/clipboard'
              // For now, just show the email
              console.log('Email:', email);
            }
          }
        ]
      );
    }
  } catch (error) {
    console.error('Error opening email:', error);
    Alert.alert(
      'Contact Support',
      `Please email us at:\n${email}`,
      [{ text: 'OK' }]
    );
  }
};
