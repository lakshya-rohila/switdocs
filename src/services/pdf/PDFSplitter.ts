import { PDFDocument } from 'pdf-lib';
import RNFS from 'react-native-fs';
import { saveToDownloads } from '../../utils/downloader';

export type SplitMode = 'range' | 'extract' | 'every';

export type SplitResult = { paths: string[]; pageCount: number };

/**
 * Parse user input like "1-3, 5-8" or "2, 4, 7" into zero-based page indices.
 */
function parsePageIndices(input: string, mode: SplitMode, totalPages: number): number[][] {
  const text = input.trim();
  if (!text) throw new Error('Please enter page numbers.');

  if (mode === 'every') {
    const n = parseInt(text, 10);
    if (!n || n < 1) throw new Error('Enter a valid number of pages per chunk.');
    const groups: number[][] = [];
    for (let i = 0; i < totalPages; i += n) {
      const group: number[] = [];
      for (let j = i; j < Math.min(i + n, totalPages); j++) {
        group.push(j);
      }
      groups.push(group);
    }
    return groups;
  }

  if (mode === 'extract') {
    const pages = text.split(/[,\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (pages.length === 0) throw new Error('Enter valid page numbers separated by commas.');
    const indices = pages.map(p => p - 1).filter(i => i >= 0 && i < totalPages);
    if (indices.length === 0) throw new Error(`Pages out of range. This PDF has ${totalPages} pages.`);
    return [indices];
  }

  // mode === 'range'
  const ranges = text.split(',').map(s => s.trim()).filter(Boolean);
  const groups: number[][] = [];
  for (const range of ranges) {
    const match = range.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (match) {
      const start = Math.max(1, parseInt(match[1], 10)) - 1;
      const end = Math.min(totalPages, parseInt(match[2], 10)) - 1;
      if (start > end) throw new Error(`Invalid range: ${range}`);
      const group: number[] = [];
      for (let i = start; i <= end; i++) group.push(i);
      groups.push(group);
    } else {
      const single = parseInt(range, 10);
      if (isNaN(single)) throw new Error(`Invalid input: "${range}"`);
      const idx = single - 1;
      if (idx < 0 || idx >= totalPages) throw new Error(`Page ${single} is out of range (1–${totalPages}).`);
      groups.push([idx]);
    }
  }
  if (groups.length === 0) throw new Error('No valid page ranges found.');
  return groups;
}

/**
 * Split a PDF into parts using pdf-lib (pure JS).
 */
export async function splitPdf(
  inputPath: string,
  mode: SplitMode,
  rangeText: string,
): Promise<SplitResult> {
  const path = inputPath.startsWith('file://') ? inputPath.slice(7) : inputPath;
  const base64 = await RNFS.readFile(path, 'base64');
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = source.getPageCount();

  const groups = parsePageIndices(rangeText, mode, totalPages);
  const outputPaths: string[] = [];

  for (let i = 0; i < groups.length; i++) {
    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(source, groups[i]);
    for (const page of pages) {
      newDoc.addPage(page);
    }
    const newBytes = await newDoc.save();
    const outBase64 = btoa(String.fromCharCode(...newBytes));
    const tempPath = `${RNFS.CachesDirectoryPath}/split-part${i + 1}-${Date.now()}.pdf`;
    await RNFS.writeFile(tempPath, outBase64, 'base64');
    const fileName = `split-part${i + 1}-${Date.now()}.pdf`;
    const saved = await saveToDownloads(tempPath, fileName);
    outputPaths.push(saved ?? tempPath);
  }

  return { paths: outputPaths, pageCount: totalPages };
}
