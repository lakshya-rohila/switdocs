import ReactNativeBlobUtil from 'react-native-blob-util';
import { PermissionsAndroid, Platform } from 'react-native';
import { showToast } from './toast';

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version >= 33) return true; // Android 13+ no storage permission needed for Downloads

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'SwiftDocs needs storage access to save files to your Downloads folder.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

// Save any file (from temp/cache) into the device Downloads folder
export const saveToDownloads = async (
  sourcePath: string,
  fileName: string
): Promise<string | null> => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showToast.error('Permission Denied', 'Allow storage access to save files');
      return null;
    }

    const downloadsPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const destPath = `${downloadsPath}/${fileName}`;

    // If file already at a path, copy it
    await ReactNativeBlobUtil.fs.cp(sourcePath, destPath);

    // Scan file into MediaStore so it appears in Files/Downloads app instantly
    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.android.addCompleteDownload({
        title: fileName,
        description: 'Downloaded via SwiftDocs',
        mime: getMimeType(fileName),
        path: destPath,
        showNotification: true,
      });
    }

    showToast.success('Saved to Downloads!', `${fileName} is ready in your Downloads folder`);
    return destPath;
  } catch (error) {
    showToast.error('Save Failed', 'Could not save file to Downloads');
    return null;
  }
};

// Write raw data (base64 or text) directly to Downloads
export const writeToDownloads = async (
  data: string,
  fileName: string,
  encoding: 'base64' | 'utf8' = 'base64'
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

    showToast.success('Saved to Downloads!', `${fileName} saved in your Downloads folder`);
    return destPath;
  } catch (error) {
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
