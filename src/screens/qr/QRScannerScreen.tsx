import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { Icon } from '../../components/common/Icon';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList, ScannerStackParamList } from '../../types/navigation';
import { spacing } from '../../theme/spacing';
import { shareText } from '../../utils/shareOpen';
import { showToast } from '../../utils/toast';

type Props =
  | NativeStackScreenProps<HomeStackParamList, typeof ROUTES.QR_SCANNER>
  | NativeStackScreenProps<ScannerStackParamList, typeof ROUTES.QR_SCANNER>;

const BOX = 240;

export default function QRScannerScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [torch, setTorch] = useState<'off' | 'on'>('off');
  const [scanned, setScanned] = useState<string | null>(null);
  const lastTick = useRef(0);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch(() => {});
    }
  }, [hasPermission, requestPermission]);

  const onCodeScanned = useCallback((codes: Array<{ type?: string; value?: string }>) => {
    const now = Date.now();
    if (now - lastTick.current < 1500) return; // debounce 1.5s
    const value = codes.find(c => c.value?.trim())?.value;
    if (!value) return;
    lastTick.current = now;
    setScanned(value);
    Vibration.vibrate(60); // brief haptic
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'pdf-417', 'data-matrix', 'aztec'],
    onCodeScanned,
  });

  function copyResult() {
    if (!scanned) return;
    Clipboard.setString(scanned);
    showToast.success('Copied!', scanned.length > 60 ? `${scanned.slice(0, 60)}…` : scanned);
  }

  function shareResult() {
    if (!scanned) return;
    shareText({ title: 'Scanned code', message: scanned }).catch(() => {});
  }

  // ── Permission / no-camera states ─────────────────────────────────────────

  if (!hasPermission) {
    return (
      <View style={[styles.root, styles.centred]}>
        <View style={styles.permIconWrap}><Icon name="camera" size={48} color="#2563EB" /></View>
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permSub}>
          Allow camera access to scan QR codes and barcodes.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => requestPermission().catch(() => {})}
          style={styles.permBtn}
        >
          <Text style={styles.permBtnText}>Allow Camera</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={{ marginTop: spacing.md }}
        >
          <Text style={{ color: '#94A3B8', fontSize: 15 }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.root, styles.centred]}>
        <View style={styles.permIconWrap}><Icon name="camera-off" size={48} color="#94A3B8" /></View>
        <Text style={styles.permTitle}>No camera found</Text>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }}>
          <Text style={{ color: '#94A3B8', fontSize: 15 }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // ── Main scanner view ──────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      {/* Camera */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        codeScanner={codeScanner}
        torch={torch}
      />

      {/* Dark vignette overlay — top */}
      <View style={styles.vignetteTop} />

      {/* Top controls */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={16}
          onPress={() => navigation.goBack()}
          style={styles.topBtn}
        >
          <Icon name="x" size={20} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.topTitle}>Scan QR / Barcode</Text>

        <Pressable
          accessibilityRole="button"
          hitSlop={16}
          onPress={() => setTorch(t => (t === 'on' ? 'off' : 'on'))}
          style={[styles.topBtn, torch === 'on' && styles.topBtnActive]}
        >
          <Icon name={torch === 'on' ? 'zap-off' : 'zap'} size={20} color={torch === 'on' ? '#FDE68A' : '#FFFFFF'} />
        </Pressable>
      </View>

      {/* Scan frame */}
      <View style={styles.frameWrap} pointerEvents="none">
        <View style={[styles.frame, scanned && styles.frameSuccess]}>
          <Corner pos="tl" active={!!scanned} />
          <Corner pos="tr" active={!!scanned} />
          <Corner pos="bl" active={!!scanned} />
          <Corner pos="br" active={!!scanned} />
        </View>
        <Text style={styles.frameHint}>
          {scanned ? '✓ Code detected' : 'Point camera at a QR code or barcode'}
        </Text>
      </View>

      {/* Dark vignette — bottom */}
      <View style={styles.vignetteBottom} />

      {/* Bottom result sheet */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        {scanned ? (
          <>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetDot} />
              <Text style={styles.sheetLabel}>Scanned</Text>
            </View>
            <Text style={styles.sheetValue} numberOfLines={4} selectable>
              {scanned}
            </Text>
            <View style={styles.sheetActions}>
              <Pressable
                accessibilityRole="button"
                onPress={copyResult}
                style={[styles.actionBtn, styles.actionBtnPrimary]}
              >
                <Text style={styles.actionBtnPrimaryText}>Copy</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={shareResult}
                style={[styles.actionBtn, styles.actionBtnGhost]}
              >
                <Text style={styles.actionBtnGhostText}>Share</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setScanned(null)}
                style={[styles.actionBtn, styles.actionBtnGhost]}
              >
                <Text style={styles.actionBtnGhostText}>Clear</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.idleSheet}>
            <ActivityIndicator color="#2563EB" size="small" />
            <Text style={styles.idleText}>Scanning…</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Corner accent component ────────────────────────────────────────────────────

function Corner({ pos, active }: { pos: 'tl' | 'tr' | 'bl' | 'br'; active: boolean }) {
  const color = active ? '#22C55E' : '#38BDF8';
  const base: Record<string, number | string> = {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: color,
  };
  const borders: Record<typeof pos, object> = {
    tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
    tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
    br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  };
  return <View style={[base, borders[pos]]} />;
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  centred: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },

  // Permission screen
  permIconWrap: { marginBottom: spacing.md },
  permTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  permSub: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  permBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: spacing.sm,
  },
  permBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    zIndex: 10,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnActive: {
    backgroundColor: 'rgba(250,204,21,0.25)',
  },

  topTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Vignette overlays
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 220,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Scan frame
  frameWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  frame: {
    width: BOX,
    height: BOX,
    borderRadius: 20,
  },
  frameSuccess: {},
  frameHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Bottom sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sheetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  sheetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22C55E',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sheetValue: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: spacing.md,
    fontFamily: 'monospace' as const,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnPrimary: { backgroundColor: '#2563EB' },
  actionBtnGhost: { backgroundColor: '#F1F5F9' },
  actionBtnPrimaryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  actionBtnGhostText: { color: '#0F172A', fontSize: 15, fontWeight: '600' },

  // Idle state
  idleSheet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  idleText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});
