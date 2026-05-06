import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';

import { GhostButton } from '../../components/common/AppHeader';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList, ScannerStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { useAppTheme } from '../../theme/ThemeProvider';
import { shareText } from '../../utils/shareOpen';

type Props =
  | NativeStackScreenProps<HomeStackParamList, typeof ROUTES.QR_SCANNER>
  | NativeStackScreenProps<ScannerStackParamList, typeof ROUTES.QR_SCANNER>;

const BOX = 240;

export default function QRScannerScreen({ navigation }: Props) {
  const { typography } = useAppTheme();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [torch, setTorch] = useState<'off' | 'on'>('off');
  const [lastCodes, setLastCodes] = useState<string[]>([]);
  const lastTick = useRef(0);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch(() => {});
    }
  }, [hasPermission, requestPermission]);

  const onCodeScanned = useCallback((codes: Array<{ type?: string; value?: string }>) => {
    const now = Date.now();
    if (now - lastTick.current < 420) {
      return;
    }
    const values = codes.map(c => c.value).filter((v): v is string => Boolean(v?.length));
    if (!values.length) {
      return;
    }
    lastTick.current = now;
    const unique = [...new Set(values)];
    setLastCodes(prev => {
      const same = prev.length === unique.length && unique.every((v, i) => v === prev[i]);
      return same ? prev : unique;
    });
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'codabar'],
    onCodeScanned,
  });

  const permissionDenied = useMemo(() => hasPermission === false, [hasPermission]);

  async function flashToggle() {
    if (!device?.hasTorch) {
      Alert.alert('Torch unavailable', 'This camera has no flashlight.');
      return;
    }
    setTorch(t => (t === 'on' ? 'off' : 'on'));
  }

  function handleCopy(payload: string) {
    Clipboard.setString(payload);
    Alert.alert('Copied', payload.length > 200 ? `${payload.slice(0, 200)}…` : payload);
  }

  return (
    <View style={styles.root}>
      {!hasPermission ? (
        <View style={[styles.permissionBlock]}>
          <Text style={[typography.bodyLarge, styles.permissionCopy]}>
            {permissionDenied
              ? 'Camera access is denied. Vision Camera relies on CameraX + ML Kit style decoders underneath for QR payloads.'
              : 'Preparing Camera permission gate…'}
          </Text>
          <ActivityIndicator color="#CBD5F5" />
          <GhostButton label="Grant camera access" onPress={() => requestPermission()} />
        </View>
      ) : device ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          codeScanner={codeScanner}
          torch={torch}
        />
      ) : (
        <View style={[styles.permissionBlock]}>
          <Text style={[typography.bodyLarge, styles.permissionCopy]}>No usable camera detected.</Text>
        </View>
      )}

      <View style={styles.overlayTop}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} hitSlop={16}>
          <Text style={[typography.button, styles.overlayTint]}>Close</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={flashToggle} hitSlop={16}>
          <Text style={[typography.button, styles.overlayTint]}>
            {torch === 'on' ? 'Torch off' : 'Torch on'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.overlayFrameWrap} pointerEvents="none">
        <View style={[styles.frame, styles.frameTranslucent]}>
          <View style={[styles.cornerAccent, styles.tl]} />
          <View style={[styles.cornerAccent, styles.tr]} />
          <View style={[styles.cornerAccent, styles.bl]} />
          <View style={[styles.cornerAccent, styles.br]} />
        </View>
      </View>

      <Text style={[typography.bodyLarge, styles.helpBanner]} pointerEvents="none">
        Vision Camera streams frames locally; barcode hooks surface decoded QR strings without leaving the handset.
      </Text>

      <View style={[styles.sheet, styles.sheetGlow]}>
        <Text style={[typography.h3]}>Last capture</Text>
        <Text selectable style={[typography.body]} numberOfLines={8}>
          {lastCodes.join('\n\n') || 'No payloads yet'}
        </Text>
        <GhostButton
          label="Copy payload"
          onPress={() => {
            const blob = lastCodes.join('\n');
            if (!blob) {
              Alert.alert('Nothing to copy yet.');
              return;
            }
            handleCopy(blob);
          }}
        />
        <GhostButton
          label="Share payload"
          onPress={() => {
            const blob = lastCodes.join('\n');
            if (!blob) {
              return;
            }
            shareText({ title: 'QR payload', message: blob }).catch(() => {});
          }}
        />
      </View>
    </View>
  );
}

const EDGE = {
  width: 44,
  height: 4,
  backgroundColor: '#60A5FA',
  borderRadius: 4,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#010511',
    paddingBottom: spacing.lg + 30,
    paddingHorizontal: spacing.screenHorizontal,
  },
  permissionBlock: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: '#020617',
    gap: spacing.md,
  },
  permissionCopy: {
    color: '#EFF6FF',
    textAlign: 'center',
  },
  overlayTop: {
    position: 'absolute',
    top: spacing.xxl + 28,
    left: spacing.screenHorizontal + 12,
    right: spacing.screenHorizontal + 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayTint: {
    color: '#DBEAFE',
  },
  overlayFrameWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    marginTop: 40,
    width: BOX,
    height: BOX,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameTranslucent: {
    backgroundColor: 'transparent',
    borderColor: '#38BDF8',
  },
  cornerAccent: EDGE,
  tl: { position: 'absolute', top: 12, left: 16 },
  tr: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  bl: {
    position: 'absolute',
    bottom: 12,
    left: 16,
  },
  br: {
    position: 'absolute',
    bottom: 12,
    right: 16,
  },
  sheet: {
    width: '100%',
    gap: spacing.sm + 2,
    padding: spacing.xl,
    marginTop: 'auto',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  sheetGlow: {
    backgroundColor: 'rgba(243,246,255,0.96)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CBD5F5',
  },
  helpBanner: {
    position: 'absolute',
    bottom: '34%',
    left: spacing.screenHorizontal + 24,
    right: spacing.screenHorizontal + 24,
    textAlign: 'center',
    color: '#E0F2FE',
  },
});
