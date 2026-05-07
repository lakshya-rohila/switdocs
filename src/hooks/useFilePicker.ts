import { useCallback } from 'react';
import RNFS from 'react-native-fs';
import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types as DocTypes,
} from '@react-native-documents/picker';
import ImageCropPicker from 'react-native-image-crop-picker';

export type PickedFile = {
  uri: string;
  name: string;
  mime?: string | null;
  size?: number | null;
};

async function stabilizeUri(primaryUri: string, nameHint: string): Promise<string> {
  let path = primaryUri.startsWith('file://') ? primaryUri.slice('file://'.length) : primaryUri;
  if (path.startsWith('/') && (await RNFS.exists(path))) {
    return path;
  }

  const cleanName = nameHint.replace(/[^a-zA-Z0-9._-]+/g, '_') || 'upload.bin';
  const destPath = `${RNFS.CachesDirectoryPath}/swiftdocs-${Date.now()}-${cleanName}`;
  try {
    await RNFS.copyFile(primaryUri.replace(/^file:\/\//, ''), destPath);
    return destPath;
  } catch {
    return path.startsWith('/') ? path : primaryUri.replace(/^file:\/\//, '');
  }
}

function isUserCancelled(e: unknown) {
  return isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED;
}

export function useFilePicker() {
  const pickOfficeOrPdf = useCallback(async (): Promise<PickedFile | null> => {
    try {
      const [res] = await pick({
        type: [
          DocTypes.pdf,
          DocTypes.doc,
          DocTypes.docx,
          DocTypes.images,
          DocTypes.ppt,
          DocTypes.pptx,
          DocTypes.plainText,
          DocTypes.allFiles,
        ],
        allowMultiSelection: false,
        mode: 'import',
      });
      if (!res?.uri || res.error) {
        return null;
      }

      const name = res.name ?? 'document.bin';
      const mimeForVirtual =
        res.isVirtual && res.convertibleToMimeTypes?.[0]?.mimeType
          ? res.convertibleToMimeTypes[0].mimeType
          : undefined;

      const copied = await keepLocalCopy({
        files: [{ uri: res.uri, fileName: name, ...(mimeForVirtual ? { convertVirtualFileToType: mimeForVirtual } : {}) }],
        destination: 'cachesDirectory',
      });
      const first = copied[0];
      let stable: string;
      if (first?.status === 'success') {
        const u = first.localUri;
        stable = u.startsWith('file://') ? u.slice('file://'.length) : u;
      } else {
        stable = await stabilizeUri(res.uri, name);
      }

      return {
        uri: stable,
        name,
        mime: res.type ?? null,
        size: res.size ?? null,
      };
    } catch (e: unknown) {
      if (isUserCancelled(e)) {
        return null;
      }
      return null;
    }
  }, []);

  const pickImageFromFiles = useCallback(async (): Promise<PickedFile | null> => {
    try {
      // Use ImageCropPicker.openPicker — opens the native photo gallery on both platforms
      // and always returns a local file:// path, so RNFS can read it directly.
      const result = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: false,
        includeBase64: false,
        includeExif: false,
      });

      if (!result?.path) return null;

      // Normalize to bare path (no file:// prefix)
      const bare = result.path.startsWith('file://')
        ? result.path.slice('file://'.length)
        : result.path;

      const filename = result.filename
        ?? bare.split('/').pop()
        ?? `image-${Date.now()}.jpg`;

      return {
        uri: bare,
        name: filename,
        mime: result.mime ?? 'image/jpeg',
        size: result.size ?? null,
      };
    } catch (e: unknown) {
      // user cancelled (error code 'E_PICKER_CANCELLED') or other
      return null;
    }
  }, []);

  const pickMultiplePdfs = useCallback(async (): Promise<PickedFile[]> => {
    try {
      const results = await pick({
        type: [DocTypes.pdf],
        allowMultiSelection: true,
        mode: 'import',
      });
      if (!results?.length) {
        return [];
      }
      const files: PickedFile[] = [];
      for (const res of results) {
        if (!res?.uri || res.error) {
          continue;
        }
        const name = res.name ?? 'document.pdf';
        const copied = await keepLocalCopy({
          files: [{ uri: res.uri, fileName: name }],
          destination: 'cachesDirectory',
        });
        const first = copied[0];
        let stable: string;
        if (first?.status === 'success') {
          const u = first.localUri;
          stable = u.startsWith('file://') ? u.slice('file://'.length) : u;
        } else {
          stable = await stabilizeUri(res.uri, name);
        }
        files.push({ uri: stable, name, mime: res.type ?? 'application/pdf', size: res.size ?? null });
      }
      return files;
    } catch (e: unknown) {
      if (isUserCancelled(e)) {
        return [];
      }
      return [];
    }
  }, []);

  return {
    pickDocumentFromFiles: pickOfficeOrPdf,
    pickDocument: pickOfficeOrPdf,
    pickImageFromFiles,
    pickMultiplePdfs,
  };
}
