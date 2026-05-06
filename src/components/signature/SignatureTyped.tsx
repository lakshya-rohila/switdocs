import React from 'react';
import { Text, View } from 'react-native';

export function SignatureTypedPreview({ label }: { label: string }) {
  return (
    <View
      accessible
      accessibilityLabel="Typed signature preview"
      style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 32, fontStyle: 'italic', color: '#0F172A' }}>{label}</Text>
    </View>
  );
}
