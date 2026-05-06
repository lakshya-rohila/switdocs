import RNFS from 'react-native-fs';

const REL_ROOT = 'SwiftDocs';

/** Logical documents root under RNFS.DocumentDirectoryPath. */
export const FilePaths = {
  documentsRoot: (): string => `${RNFS.DocumentDirectoryPath}/${REL_ROOT}`,

  documentFile: (...segments: string[]): string =>
    `${RNFS.DocumentDirectoryPath}/${REL_ROOT}/${segments.map(s => String(s)).join('/')}`,

  /** Safe temp area for uploads or conversions. */
  cacheFile: (...segments: string[]): string =>
    `${RNFS.CachesDirectoryPath}/${segments.map(s => String(s)).join('/')}`,
};

export async function mkdirSafe(pathSegments: string[]) {
  const full = `${RNFS.DocumentDirectoryPath}/${REL_ROOT}/${pathSegments.join('/')}`;
  const exists = await RNFS.exists(full);
  if (!exists) {
    await RNFS.mkdir(full);
  }
}

export async function ensureSwiftDocsRoot() {
  const root = FilePaths.documentsRoot();
  if (!(await RNFS.exists(root))) {
    await RNFS.mkdir(root);
  }
}
