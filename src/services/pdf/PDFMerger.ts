import { PDFDocument } from 'pdf-lib';
import RNFS from 'react-native-fs';
import { saveToDownloads } from '../../utils/downloader';

/**
 * Merge multiple PDF files into a single PDF using pdf-lib (pure JS, no native module).
 * Returns the path to the merged output file.
 */
export async function mergeMultiplePdfs(paths: string[]): Promise<string> {
  if (paths.length < 2) throw new Error('At least 2 PDF files are needed to merge.');

  const merged = await PDFDocument.create();

  for (const rawPath of paths) {
    const path = rawPath.startsWith('file://') ? rawPath.slice(7) : rawPath;
    const base64 = await RNFS.readFile(path, 'base64');
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const donor = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(donor, donor.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  const mergedBytes = await merged.save();
  const outBase64 = btoa(String.fromCharCode(...mergedBytes));
  const tempPath = `${RNFS.CachesDirectoryPath}/merged-${Date.now()}.pdf`;
  await RNFS.writeFile(tempPath, outBase64, 'base64');

  const fileName = `merged-${Date.now()}.pdf`;
  const savedPath = await saveToDownloads(tempPath, fileName);
  return savedPath ?? tempPath;
}
