import React from 'react';
import { Image, StyleSheet } from 'react-native';

export function SignaturePreviewCard({ uri }: { uri?: string }) {
  if (!uri) {
    return (
      <Image
        accessibilityIgnoresInvertColors
        style={styles.blank}
      />
    );
  }
  return <Image accessibilityIgnoresInvertColors source={{ uri }} style={styles.preview} />;
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    aspectRatio: 3,
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  blank: {
    width: '100%',
    aspectRatio: 3,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
