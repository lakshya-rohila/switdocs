import ReactNativeBlobUtil from 'react-native-blob-util';
import { PermissionsAndroid, Platform } from 'react-native';
import { showToast } from './toast';
import { store } from '../store';
import { recentFilesActions } from '../store/slices/recentFilesSlice';

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;
  if ((Platform.Version as number) >= 33) return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'SwiftDocs needs storage access to save files to your Downloads folder.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

/** Record a saved file in the Recent Files Redux store */
function recordRecent(destPath: string, fileName: string) {
  try {
    store.dispatch(
      recentFilesActions.addRecent({
        id: `${Date.now()}-${fileName}`,
        uri: destPath,
        name: fileName,
        mimeType: getMimeType(fileName),
        modifiedAt: Date.now(),
      }),
    );
  } catch {
    // non-fatal — recent files tracking is best-effort
  }
}

/** Copy an existing temp/cache file into the device Downloads folder */
export const saveToDownloads = async (
  sourcePath: string,
  fileName: string,
): Promise<string | null> => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showToast.error('Permission Denied', 'Allow storage access to save files');
      return null;
    }

    const downloadsPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const destPath = `${downloadsPath}/${fileName}`;

    await ReactNativeBlobUtil.fs.cp(sourcePath, destPath);

    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.android.addCompleteDownload({
        title: fileName,
        description: 'Saved via SwiftDocs',
        mime: getMimeType(fileName),
        path: destPath,
        showNotification: true,
      });
    }

    showToast.success('Saved!', `${fileName} saved to Downloads`);
    recordRecent(destPath, fileName);
    return destPath;
  } catch {
    showToast.error('Save Failed', 'Could not save file to Downloads');
    return null;
  }
};

/** Write raw base64 or utf8 data directly into the device Downloads folder */
export const writeToDownloads = async (
  data: string,
  fileName: string,
  encoding: 'base64' | 'utf8' = 'base64',
): Promise<string | null> => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showToast.error('Permission Denied', 'Allow storage access to save files');
      return null;
    }

    const downloadsPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const destPath = `${downloadsPath}/${fileName}`;

    await ReactNativeBlobUtil.fs.writeFile(destPath, data, encoding);

    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.android.addCompleteDownload({
        title: fileName,
        description: 'Created via SwiftDocs',
        mime: getMimeType(fileName),
        path: destPath,
        showNotification: true,
      });
    }

    showToast.success('Saved!', `${fileName} saved to Downloads`);
    recordRecent(destPath, fileName);
    return destPath;
  } catch {
    showToast.error('Save Failed', 'Could not write file to Downloads');
    return null;
  }
};

const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    txt: 'text/plain',
    svg: 'image/svg+xml',
  };
  return mimeMap[ext ?? ''] ?? 'application/octet-stream';
};
