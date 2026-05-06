import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_ONBOARDING = '@swiftdocs_onboarding_v1';

export async function persistOnboardingComplete() {
  await AsyncStorage.setItem(STORAGE_ONBOARDING, 'complete');
}

export async function isOnboardingComplete() {
  const value = await AsyncStorage.getItem(STORAGE_ONBOARDING);
  return value === 'complete';
}
