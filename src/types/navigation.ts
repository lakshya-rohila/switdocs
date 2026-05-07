import { ROUTES } from '../navigation/routes';

export type HomeStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.SEARCH]: undefined;
  [ROUTES.E_SIGNATURE]: undefined;
  [ROUTES.DOCUMENT_CONVERTER]: undefined;
  [ROUTES.CREATE_PDF]: undefined;
  [ROUTES.MERGE_PDF]: undefined;
  [ROUTES.SPLIT_PDF]: undefined;
  [ROUTES.COMPRESS_PDF]: undefined;
  [ROUTES.IMAGE_CONVERTER]: undefined;
  [ROUTES.IMAGE_COMPRESS]: undefined;
  [ROUTES.IMAGE_RESIZE]: undefined;
  [ROUTES.IMAGE_CROP]: undefined;
  [ROUTES.QR_GENERATOR]: undefined;
  [ROUTES.WORD_COUNTER]: undefined;
};

export type RecentStackParamList = {
  [ROUTES.RECENT_FILES]: undefined;
};

export type SettingsStackParamList = {
  [ROUTES.SETTINGS]: undefined;
};

export type MainTabParamList = {
  [ROUTES.TAB_HOME]: undefined;
  [ROUTES.TAB_RECENT]: undefined;
  [ROUTES.TAB_SETTINGS]: undefined;
};

export type RootStackParamList = {
  [ROUTES.ROOT_SPLASH]: undefined;
  [ROUTES.ROOT_ONBOARDING]: undefined;
  [ROUTES.ROOT_MAIN]: undefined;
};
