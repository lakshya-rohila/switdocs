/** MIME helpers — extend when wiring pickers/converters */

export function extFromMime(mime?: string): string {
  if (!mime) return '';
  switch (mime) {
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return mime.split('/').pop() ?? '';
  }
}

export function formatExtension(name: string): string {
  const parts = name.split('.');
  if (parts.length < 2) return '';
  return parts.pop()?.toLowerCase() ?? '';
}

export function mimeFromFilename(name: string): string {
  const ext = formatExtension(name);
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    default:
      return 'application/octet-stream';
  }
}
