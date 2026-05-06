export const ROUTES = {
  ROOT_SPLASH: 'RootSplash',
  ROOT_ONBOARDING: 'RootOnboarding',
  ROOT_MAIN: 'RootMain',

  TAB_HOME: 'TabHome',
  TAB_RECENT: 'TabRecent',
  TAB_SCANNER: 'TabScanner',
  TAB_SETTINGS: 'TabSettings',

  HOME: 'Home',
  SEARCH: 'Search',

  E_SIGNATURE: 'ESignature',

  DOCUMENT_CONVERTER: 'DocumentConverter',

  CREATE_PDF: 'CreatePDF',
  MERGE_PDF: 'MergePDF',
  SPLIT_PDF: 'SplitPDF',
  COMPRESS_PDF: 'CompressPDF',
  ROTATE_PDF: 'RotatePDF',
  WATERMARK_PDF: 'WatermarkPDF',
  LOCK_PDF: 'LockPDF',
  UNLOCK_PDF: 'UnlockPDF',

  IMAGE_CONVERTER: 'ImageConverter',
  IMAGE_COMPRESS: 'ImageCompress',
  IMAGE_RESIZE: 'ImageResize',
  IMAGE_CROP: 'ImageCrop',

  QR_GENERATOR: 'QRGenerator',
  QR_SCANNER: 'QRScanner',

  RECENT_FILES: 'RecentFiles',
  SETTINGS: 'Settings',

  WORD_COUNTER: 'WordCounter',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
