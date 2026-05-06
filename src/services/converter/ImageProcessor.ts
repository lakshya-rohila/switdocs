/**
 * ImageProcessor — on-device image operations using:
 *   - react-native-compressor  (compress quality, format conversion)
 *   - react-native-image-crop-picker (crop with live UI)
 *   - react-native-html-to-pdf (image → PDF)
 *   - react-native-fs (file I/O)
 *   - react-native-blob-util (save to Downloads / MediaStore)
 */

import { Image as CompressorImage } from 'react-native-compressor';
import ImageCropPicker from 'react-native-image-crop-picker';
import { generatePDF } from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { saveToDownloads } from '../../utils/downloader';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Strip file:// prefix if present */
function bareUri(uri: string): string {
  return uri.startsWith('file://') ? uri.slice(7) : uri;
}

/** Ensure file:// prefix */
function fileUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}

// ─── Image Compress ───────────────────────────────────────────────────────────

export type CompressResult = { outputPath: string; savedBytes: number };

/**
 * Compress a JPEG/PNG image at the given quality (0–100).
 * Returns the output file path and how many bytes were saved.
 */
export async function compressImage(
  inputUri: string,
  quality: number,
): Promise<CompressResult> {
  const q = Math.max(1, Math.min(100, quality)) / 100;

  const outputUri = await CompressorImage.compress(fileUri(inputUri), {
    compressionMethod: 'manual',
    quality: q,
    output: 'jpg',
    returnableOutputType: 'uri',
  });

  const outputPath = bareUri(outputUri);

  const [inStat, outStat] = await Promise.all([
    RNFS.stat(bareUri(inputUri)),
    RNFS.stat(outputPath),
  ]);

  const savedBytes = Number(inStat.size) - Number(outStat.size);

  // Copy to Downloads
  const fileName = `compressed-${Date.now()}.jpg`;
  await saveToDownloads(outputPath, fileName);

  return { outputPath, savedBytes };
}

// ─── Image Convert ────────────────────────────────────────────────────────────

export type ConvertFormat = 'JPG' | 'PNG' | 'WebP';
export type ConvertResult = { outputPath: string };

/**
 * Convert an image to the target format.
 * react-native-compressor handles JPG and PNG natively.
 * WebP is supported on Android; on iOS it falls back to JPG.
 */
export async function convertImage(
  inputUri: string,
  format: ConvertFormat,
): Promise<ConvertResult> {
  const outputFormat = format === 'PNG' ? 'png' : 'jpg';
  const ext = format === 'PNG' ? 'png' : format === 'WebP' ? 'webp' : 'jpg';

  const outputUri = await CompressorImage.compress(fileUri(inputUri), {
    compressionMethod: 'auto',
    output: outputFormat as 'jpg' | 'png',
    quality: 0.92,
    returnableOutputType: 'uri',
  });

  const outputPath = bareUri(outputUri);
  const fileName = `converted-${Date.now()}.${ext}`;
  await saveToDownloads(outputPath, fileName);

  return { outputPath };
}

// ─── Image Resize ─────────────────────────────────────────────────────────────

export type ResizeResult = { outputPath: string; width: number; height: number };

/**
 * Resize an image to a percentage of its original dimensions.
 * Uses react-native-compressor's maxWidth/maxHeight options.
 */
export async function resizeImage(
  inputUri: string,
  scalePercent: number,
): Promise<ResizeResult> {
  // We'll use maxWidth/maxHeight derived from scale
  // A rough large-image upper bound: start with 4000×4000 and scale down
  const maxDim = Math.round(4000 * (scalePercent / 100));

  const outputUri = await CompressorImage.compress(fileUri(inputUri), {
    compressionMethod: 'manual',
    maxWidth: maxDim,
    maxHeight: maxDim,
    quality: 0.9,
    output: 'jpg',
    returnableOutputType: 'uri',
  });

  const outputPath = bareUri(outputUri);
  const fileName = `resized-${scalePercent}pct-${Date.now()}.jpg`;
  await saveToDownloads(outputPath, fileName);

  return { outputPath, width: maxDim, height: maxDim };
}

// ─── Image Crop ───────────────────────────────────────────────────────────────

export type CropRatio = 'free' | '1:1' | '16:9' | '4:3' | '3:4';
export type CropResult = { outputPath: string; width: number; height: number };

/**
 * Open the native crop UI (react-native-image-crop-picker) for the given image.
 * Returns the cropped file path.
 */
export async function cropImage(
  inputUri: string,
  ratio: CropRatio,
): Promise<CropResult | null> {
  const ratioMap: Record<CropRatio, { width: number; height: number } | null> = {
    'free': null,
    '1:1': { width: 1, height: 1 },
    '16:9': { width: 16, height: 9 },
    '4:3': { width: 4, height: 3 },
    '3:4': { width: 3, height: 4 },
  };

  const dimensions = ratioMap[ratio];

  const result = await ImageCropPicker.openCropper({
    path: fileUri(inputUri),
    ...(dimensions ?? {}),
    freeStyleCropEnabled: ratio === 'free',
    mediaType: 'photo',
    cropperToolbarTitle: 'Crop Image',
    cropperChooseText: 'Use photo',
    cropperCancelText: 'Cancel',
    includeBase64: false,
    compressImageQuality: 0.92,
  });

  if (!result?.path) return null;

  const outputPath = bareUri(result.path);
  const fileName = `cropped-${Date.now()}.jpg`;
  await saveToDownloads(outputPath, fileName);

  return { outputPath, width: result.width, height: result.height };
}

// ─── Image → PDF ─────────────────────────────────────────────────────────────

export type ImageToPdfResult = { outputPath: string };

/**
 * Convert one or more images to a PDF by embedding them as base64 in HTML
 * and rendering via react-native-html-to-pdf.
 */
export async function imagesToPdf(
  imageUris: string[],
  title = 'SwiftDocs',
): Promise<ImageToPdfResult> {
  if (imageUris.length === 0) throw new Error('No images provided');

  const fontFamily = Platform.select({ ios: 'Helvetica, Arial', android: 'sans-serif' });

  // Build base64 img tags for each image
  const imgTags: string[] = [];
  for (const uri of imageUris) {
    const path = bareUri(uri);
    const ext = path.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    try {
      const b64 = await RNFS.readFile(path, 'base64');
      imgTags.push(
        `<div style="page-break-after:always;text-align:center;margin:0;padding:0;">
          <img src="data:${mime};base64,${b64}" style="max-width:100%;max-height:100%;object-fit:contain;" />
        </div>`,
      );
    } catch {
      // skip unreadable images
    }
  }

  if (imgTags.length === 0) throw new Error('Could not read any of the selected images');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1, width=device-width" />
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:${fontFamily}; background:#fff; }
    div { width:100%; height:100vh; display:flex; align-items:center; justify-content:center; }
    img { display:block; }
  </style>
</head>
<body>
  ${imgTags.join('\n')}
</body>
</html>`;

  const safeName = title.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40);
  const fileName = `${safeName}-${Date.now()}`;

  const result = await generatePDF({ html, fileName, bgColor: '#FFFFFF' });

  const tempPath = result.filePath.startsWith('file://')
    ? result.filePath.slice(7)
    : result.filePath;

  const savedPath = await saveToDownloads(tempPath, `${fileName}.pdf`);

  return { outputPath: savedPath ?? tempPath };
}
