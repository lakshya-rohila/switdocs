/**
 * Thin wrapper for READ_MEDIA_* / storage permission flows once native modules ship.
 */

export async function ensureStoragePermission(): Promise<boolean> {
  return true;
}
