/**
 * Frontend-only SwiftDocs: no bundled backend or third-party conversion APIs.
 * High‑fidelity office conversions (DOCX ⇄ PDF etc.) typically need WASM, native codecs,
 * or a server you control — none of that ships here so we never transmit files off-device.
 */

export type ConverterFormatTag = 'pdf' | 'docx' | 'png' | 'pptx';

export type OfflineConversionAttempt = {
  downloadUrl?: string;
  exportFilename?: string;
  error?: string;
};

export const OFFICE_CONVERSION_NOT_AVAILABLE =
  'SwiftDocs stays on your phone: there is no cloud service and no conversion server. ' +
  'Office-grade format changes are not built into this frontend-only stack. Use “Share original file” to open it elsewhere, or plug in your own on-device WASM/native engine later.';

/** Intentionally does not upload or call remote APIs — returns a deterministic offline result. */
export async function convertDocumentOnDevice(_args: {
  fileUri: string;
  fileName: string;
  inputFormat: ConverterFormatTag;
  outputFormat: ConverterFormatTag;
}): Promise<OfflineConversionAttempt> {
  return Promise.resolve({
    error: OFFICE_CONVERSION_NOT_AVAILABLE,
  });
}

export function formatTagFromBubble(bubble: string): ConverterFormatTag {
  switch (bubble.toUpperCase()) {
    case 'DOCX':
      return 'docx';
    case 'PNG':
      return 'png';
    case 'PPTX':
      return 'pptx';
    default:
      return 'pdf';
  }
}
