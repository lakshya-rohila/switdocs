import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import type { AnimationObject } from 'lottie-react-native';

type AnimatedIconProps = {
  source: string;
  size?: number;
  style?: object;
  loop?: boolean;
  autoPlay?: boolean;
};

export function AnimatedIcon({
  source,
  size = 42,
  style,
  loop = false,
  autoPlay = true,
}: AnimatedIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LottieView
        source={getIconSource(source) as AnimationObject}
        autoPlay={autoPlay}
        loop={loop}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

function getIconSource(name: string): AnimationObject {
  const iconMap: Record<string, AnimationObject> = {
    loading: require('../../../assets/animations/loading.json'),
    'pdf-create': require('../../../assets/animations/icons/pdf-create.json'),
    'pdf-merge': require('../../../assets/animations/icons/pdf-merge.json'),
    'pdf-split': require('../../../assets/animations/icons/pdf-split.json'),
    'pdf-compress': require('../../../assets/animations/icons/pdf-compress.json'),
    signature: require('../../../assets/animations/icons/signature.json'),
    converter: require('../../../assets/animations/icons/converter.json'),
    'image-convert': require('../../../assets/animations/icons/image-convert.json'),
    'image-compress': require('../../../assets/animations/icons/image-compress.json'),
    'image-resize': require('../../../assets/animations/icons/image-resize.json'),
    'image-crop': require('../../../assets/animations/icons/image-crop.json'),
    'qr-generate': require('../../../assets/animations/icons/qr-generate.json'),
    'word-counter': require('../../../assets/animations/icons/word-counter.json'),
  };

  return iconMap[name] || iconMap.loading;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
