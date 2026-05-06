jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: View,
    GestureDetector: View,
    Swipeable: View,
    DrawerLayout: View,
    FlatList: View,
    ScrollView: View,
  };
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  __esModule: true,
  default: { setString: jest.fn() },
}));

jest.mock('react-native-fs', () => ({
  __esModule: true,
  default: {
    CachesDirectoryPath: '/tmp/cache',
    DocumentDirectoryPath: '/tmp/docs',
    TemporaryDirectoryPath: '/tmp',
    writeFile: jest.fn(() => Promise.resolve()),
    mkdir: jest.fn(() => Promise.resolve()),
    exists: jest.fn(() => Promise.resolve(true)),
    copyFile: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: { open: jest.fn(() => Promise.resolve()) },
}));

jest.mock('@react-native-documents/picker', () => ({
  __esModule: true,
  pick: jest.fn(async () => [
    {
      uri: 'file:///tmp/file.pdf',
      name: 'file.pdf',
      type: 'application/pdf',
      size: 1,
      error: null,
      nativeType: 'application/pdf',
      isVirtual: false,
      convertibleToMimeTypes: null,
      hasRequestedType: true,
    },
  ]),
  keepLocalCopy: jest.fn(async () => [
    { status: 'success', sourceUri: 'file:///tmp/file.pdf', localUri: 'file:///tmp/cache/file.pdf' },
  ]),
  types: {
    pdf: 'application/pdf',
    images: 'image/*',
    plainText: 'text/plain',
    allFiles: '*/*',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
  errorCodes: {
    OPERATION_CANCELED: 'OPERATION_CANCELED',
    IN_PROGRESS: 'IN_PROGRESS',
    UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
    NULL_PRESENTER: 'NULL_PRESENTER',
  },
  isErrorWithCode: jest.fn(() => false),
}));

jest.mock('react-native-vision-camera', () => {
  const { View } = require('react-native');
  const React = require('react');

  return {
    Camera: ({ children, ...rest }) => React.createElement(View, rest, children),
    useCameraDevice: () => ({ hasTorch: false }),
    useCodeScanner: () => ({}),
    useCameraPermission: () => ({ hasPermission: true, requestPermission: jest.fn(async () => true) }),
  };
});

jest.mock('react-native-pdf', () => {
  const { View } = require('react-native');
  const React = require('react');

  return ({ style }) => React.createElement(View, { style });
});

jest.mock('react-native-html-to-pdf', () => ({
  generatePDF: jest.fn(async () => ({ filePath: '/tmp/mock.pdf' })),
}));

jest.mock('react-native-qrcode-svg', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('react-native-signature-canvas', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return { WebView: View };
});

jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: {
      dirs: {
        DownloadDir: '/mock/downloads',
        CacheDir: '/mock/cache',
      },
      writeFile: jest.fn(() => Promise.resolve()),
      cp: jest.fn(() => Promise.resolve()),
    },
    android: {
      addCompleteDownload: jest.fn(() => Promise.resolve()),
    },
  },
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
