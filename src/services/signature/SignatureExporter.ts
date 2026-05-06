import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Share from 'react-native-share';
import { showToast } from '../../utils/toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripDataUri(dataUri: string): string {
  const idx = dataUri.indexOf(',');
  if (dataUri.startsWith('data:') && idx >= 0) {
    return dataUri.slice(idx + 1);
  }
  return dataUri;
}

function mimeFromDataUri(dataUri: string): string {
  const match = /^data:([^;,]+)[;,]/.exec(dataUri);
  return match?.[1] ?? 'image/png';
}

/** Request WRITE_EXTERNAL_STORAGE on Android < 10 */
async function ensureAndroidWritePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  if ((Platform.Version as number) >= 29) {
    // Android 10+ uses MediaStore — no runtime permission needed for own files
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'SwiftDocs needs permission to save the signature to your gallery.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

// ─── Android: save to gallery via MediaStore ──────────────────────────────────

async function saveToGalleryAndroid(base64Data: string, fileName: string, mime: string): Promise<boolean> {
  const hasPermission = await ensureAndroidWritePermission();
  if (!hasPermission) {
    Alert.alert('Permission required', 'Allow storage access so SwiftDocs can save your signature to the gallery.');
    return false;
  }

  // Write base64 to a temp cache file first
  const tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
  await RNFS.writeFile(tempPath, base64Data, 'base64');

  try {
    // Copy into MediaStore Images (appears in Gallery)
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: fileName,
        parentFolder: 'SwiftDocs',
        mimeType: mime,
      },
      'Image',
      tempPath,
    );
    // Clean up temp file
    RNFS.unlink(tempPath).catch(() => {});
    return true;
  } catch {
    // Fallback: open share sheet so user can save manually
    await Share.open({
      url: `file://${tempPath}`,
      type: mime,
      title: 'Save signature',
      failOnCancel: false,
    });
    return true;
  }
}

// ─── iOS: write to temp then open share sheet with "Save Image" option ────────

async function saveToGalleryIOS(base64Data: string, fileName: string, mime: string): Promise<boolean> {
  const tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
  await RNFS.writeFile(tempPath, base64Data, 'base64');

  // Share sheet on iOS shows "Save Image" when the file is an image
  await Share.open({
    url: `file://${tempPath}`,
    type: mime,
    title: 'Save signature',
    message: 'Save this signature to your Photos library.',
    failOnCancel: false,
  });

  return true;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Exports a rasterized signature (data:image/png;base64,…) to the device gallery.
 *
 * - Android: saves directly into the Pictures/SwiftDocs gallery folder via MediaStore.
 * - iOS: writes to a temp file and opens the share sheet so the user can tap "Save Image".
 *
 * Returns the temp file path on success, undefined on failure.
 */
export async function exportSignatureAsset(
  dataUrl: string,
  _format: 'png' | 'svg',
): Promise<string | undefined> {
  try {
    if (!dataUrl || dataUrl.length < 50) {
      showToast.error('Export failed', 'No signature data to export. Draw a signature first.');
      return undefined;
    }

    const mime = mimeFromDataUri(dataUrl);
    const extension = mime.includes('svg') ? 'svg' : 'png';
    const fileName = `signature-${Date.now()}.${extension}`;
    const base64Data = stripDataUri(dataUrl);

    let saved: boolean;

    if (Platform.OS === 'android') {
      saved = await saveToGalleryAndroid(base64Data, fileName, mime);
    } else {
      saved = await saveToGalleryIOS(base64Data, fileName, mime);
    }

    if (saved) {
      showToast.success(
        'Signature saved!',
        Platform.OS === 'android'
          ? 'Saved to your gallery (Pictures/SwiftDocs).'
          : 'Tap "Save Image" in the share sheet to add it to Photos.',
      );
    }

    return `${RNFS.CachesDirectoryPath}/${fileName}`;
  } catch (error) {
    showToast.error(
      'Export failed',
      error instanceof Error ? error.message : 'Could not save the signature.',
    );
    return undefined;
  }
}
