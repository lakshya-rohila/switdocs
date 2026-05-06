import { Linking, Alert } from 'react-native';

// Update this URL once you publish to GitHub Pages
const BASE_URL = 'https://yourusername.github.io/swiftdocs';

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
      Alert.alert('Error', `Cannot open URL: ${url}`);
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
export const openSupportEmail = () => {
  const email = 'lakshyarohila21@gmail.com';
  const subject = 'SwiftDocs Support Request';
  openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
};
