import { Platform } from 'react-native';
import Share from 'react-native-share';

function fileShareUrl(absPathOrUri: string) {
  if (absPathOrUri.startsWith('file://')) {
    return absPathOrUri;
  }
  if (Platform.OS === 'android' && absPathOrUri.startsWith('/')) {
    return `file://${absPathOrUri}`;
  }
  return absPathOrUri;
}

export async function shareLocalFile(params: {
  path: string;
  mime?: string;
  title?: string;
  message?: string;
}) {
  const url = fileShareUrl(params.path);
  await Share.open({
    title: params.title,
    url,
    type: params.mime ?? 'application/octet-stream',
    message: params.message,
    failOnCancel: false,
  });
}

export async function shareText(params: { title?: string; message: string }) {
  await Share.open({
    title: params.title,
    message: params.message,
    failOnCancel: false,
  });
}
