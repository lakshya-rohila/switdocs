import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/common/Icon';
import { useModal } from '../../components/common/AppModal';
import { useTabBarBottomPadding } from '../../navigation/MainTabsNavigator';

import { GhostButton } from '../../components/common/AppHeader';
import { PrimaryButton } from '../../components/common/AppHeader';
import { Segmented } from '../../components/common/AppHeader';
import { LabeledField } from '../../components/common/AppHeader';
import { DrawingSignatureCanvas, type DrawingSignatureHandle } from '../../components/signature/SignatureCanvas';
import { SignatureTypedPreview } from '../../components/signature/SignatureTyped';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { exportSignatureAsset } from '../../services/signature/SignatureExporter';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useFilePicker } from '../../hooks/useFilePicker';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.E_SIGNATURE>;

const PHASES = ['Method', 'Sign', 'Export'] as const;

export default function ESignatureScreen({ navigation }: Props) {
  const { typography, colors } = useAppTheme();
  const tabBarPadding = useTabBarBottomPadding();
  const showModal = useModal();
  const [phase, setPhase] = useState<(typeof PHASES)[number]>('Method');
  const [method, setMethod] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typed, setTyped] = useState('');
  const [drawSig, setDrawSig] = useState<string>('');
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);

  function advance() {
    if (phase === 'Method') {
      setPhase('Sign');
    } else if (phase === 'Sign') {
      // Validate before moving to export
      if (method === 'draw' && !drawSig) {
        showModal({ title: 'No signature', message: 'Draw your signature then tap Capture before continuing.', buttons: [{ label: 'OK', style: 'cancel' }] });
        return;
      }
      if (method === 'type' && !typed.trim()) {
        showModal({ title: 'Enter your name', message: 'Type your name before continuing.', buttons: [{ label: 'OK', style: 'cancel' }] });
        return;
      }
      if (method === 'upload' && !uploadedUri) {
        showModal({ title: 'No image', message: 'Upload a signature image before continuing.', buttons: [{ label: 'OK', style: 'cancel' }] });
        return;
      }
      setPhase('Export');
    } else {
      navigation.goBack();
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable accessibilityRole="button" hitSlop={16} onPress={() => navigation.goBack()}>
          <Icon name="x" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[typography.h3, { flex: 1, textAlign: 'center', color: colors.textPrimary }]}>
          E-Signature
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.body, { paddingBottom: tabBarPadding + spacing.md }]}
      >
        <Segmented items={[...PHASES]} value={phase} onChange={setPhase} />

        {phase === 'Method' ? (
          <MethodCards method={method} onSelect={setMethod} />
        ) : phase === 'Sign' ? (
          <AuthorWorkspace
            method={method}
            typed={typed}
            onTyped={setTyped}
            drawing={drawSig}
            onDrawing={setDrawSig}
            uploadedUri={uploadedUri}
            onUploaded={setUploadedUri}
          />
        ) : (
          <ExportDeck method={method} typed={typed} drawSig={drawSig} uploadedUri={uploadedUri} />
        )}

        <PrimaryButton
          label={phase === 'Export' ? 'Done' : 'Continue →'}
          onPress={advance}
        />
      </ScrollView>
    </View>
  );
}

// ─── Method selection ─────────────────────────────────────────────────────────

function MethodCards({ method, onSelect }: { method: 'draw' | 'type' | 'upload'; onSelect: (m: typeof method) => void }) {
  const { typography, colors } = useAppTheme();
  const options = [
    { id: 'draw' as const, icon: 'edit-3', title: 'Draw', subtitle: 'Sign with your finger or stylus' },
    { id: 'type' as const, icon: 'type', title: 'Type', subtitle: 'Generate a signature from your name' },
    { id: 'upload' as const, icon: 'image', title: 'Upload', subtitle: 'Use an existing signature image' },
  ];
  return (
    <View style={{ gap: spacing.md }}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>How would you like to create your signature?</Text>
      {options.map(option => (
        <Pressable
          key={option.id}
          accessibilityRole="radio"
          accessibilityState={{ checked: method === option.id }}
          onPress={() => onSelect(option.id)}
          style={[
            styles.methodCard,
            { borderColor: method === option.id ? colors.primary : colors.border, backgroundColor: method === option.id ? colors.primaryLight : colors.surface },
          ]}
        >
          <Icon name={option.icon} size={26} color={method === option.id ? colors.primary : colors.textSecondary} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.label, { color: colors.textPrimary }]}>{option.title}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{option.subtitle}</Text>
          </View>
          {method === option.id && <Icon name="check-circle" size={20} color={colors.primary} />}
        </Pressable>
      ))}
    </View>
  );
}

// ─── Author workspace ─────────────────────────────────────────────────────────

function AuthorWorkspace({
  method, typed, onTyped, drawing, onDrawing, uploadedUri, onUploaded,
}: {
  method: 'draw' | 'type' | 'upload';
  typed: string; onTyped: (v: string) => void;
  drawing: string; onDrawing: (v: string) => void;
  uploadedUri: string | null; onUploaded: (uri: string | null) => void;
}) {
  const { typography, colors } = useAppTheme();
  const canvasRef = useRef<DrawingSignatureHandle>(null);
  const { pickImageFromFiles } = useFilePicker();

  if (method === 'draw') {
    return (
      <View style={{ gap: spacing.md }}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>Draw your signature below, then tap Capture.</Text>
        <DrawingSignatureCanvas ref={canvasRef} onSignatureDataUrl={onDrawing} onEmpty={() => onDrawing('')} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <GhostButton label="Clear" onPress={() => { canvasRef.current?.clear(); onDrawing(''); }} />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton label="Capture" onPress={() => canvasRef.current?.read()} />
          </View>
        </View>
        {drawing.length > 24 && (
          <View style={[styles.successBadge, { backgroundColor: '#F0FDF4', borderColor: '#16A34A' }]}>
            <Icon name="check-circle" size={16} color="#16A34A" />
            <Text style={{ color: '#16A34A', fontWeight: '600', marginLeft: 6 }}>Signature captured</Text>
          </View>
        )}
      </View>
    );
  }

  if (method === 'type') {
    return (
      <View style={{ gap: spacing.md }}>
        <LabeledField
          label="Your name"
          value={typed}
          onChangeText={onTyped}
          placeholder="e.g. John Smith"
          autoFocus
        />
        {typed.trim().length > 0 && <SignatureTypedPreview label={typed} />}
      </View>
    );
  }

  // Upload
  return (
    <View style={{ gap: spacing.md }}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>Upload a photo of your handwritten signature.</Text>
      {uploadedUri ? (
        <View style={{ gap: spacing.sm }}>
          <Image
            source={{ uri: uploadedUri.startsWith('file://') ? uploadedUri : `file://${uploadedUri}` }}
            style={{ width: '100%', height: 160, borderRadius: radius.lg }}
            resizeMode="contain"
          />
          <GhostButton label="Change image" onPress={() => pickImageFromFiles().then(f => { if (f) onUploaded(`file://${f.uri}`); }).catch(() => {})} />
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => pickImageFromFiles().then(f => { if (f) onUploaded(`file://${f.uri}`); }).catch(() => {})}
          style={[styles.uploadZone, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Icon name="upload" size={40} color={colors.primary} />
          <Text style={[typography.bodyLarge, { color: colors.textPrimary, fontWeight: '600' }]}>Upload signature image</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>JPG or PNG from your gallery</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Export deck ──────────────────────────────────────────────────────────────

function ExportDeck({ method, typed, drawSig, uploadedUri }: { method: 'draw' | 'type' | 'upload'; typed: string; drawSig: string; uploadedUri: string | null }) {
  const { typography, colors } = useAppTheme();
  const showModal = useModal();
  const [exporting, setExporting] = useState(false);

  async function saveToGallery() {
    if (method === 'draw') {
      if (!drawSig) { showModal({ title: 'No signature', message: 'Go back and capture your signature first.', buttons: [{ label: 'OK', style: 'cancel' }] }); return; }
      setExporting(true);
      try { await exportSignatureAsset(drawSig, 'png'); } finally { setExporting(false); }
      return;
    }
    if (method === 'type') {
      showModal({ title: 'Typed signature', message: 'Typed signature export coming soon. Screenshot your signature from the Sign step for now.', buttons: [{ label: 'OK', style: 'cancel' }] });
      return;
    }
    if (method === 'upload' && uploadedUri) {
      showModal({ title: 'Already saved', message: 'Your uploaded image is already in your gallery.', buttons: [{ label: 'OK', style: 'cancel' }] });
      return;
    }
    showModal({ title: 'Nothing to export', message: 'Go back and complete the Sign step first.', buttons: [{ label: 'OK', style: 'cancel' }] });
  }

  return (
    <View style={{ gap: spacing.md }}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>Your signature is ready. Save it to your gallery or share it.</Text>

      {method === 'draw' && drawSig ? (
        <View style={[styles.successBadge, { backgroundColor: '#F0FDF4', borderColor: '#16A34A', flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
          <Icon name="check-circle" size={16} color="#16A34A" />
          <Text style={{ color: '#16A34A', fontWeight: '600' }}>Handwritten signature ready</Text>
        </View>
      ) : method === 'type' && typed ? (
        <SignatureTypedPreview label={typed} />
      ) : method === 'upload' && uploadedUri ? (
        <Image source={{ uri: uploadedUri }} style={{ width: '100%', height: 140, borderRadius: radius.lg }} resizeMode="contain" />
      ) : null}

      <PrimaryButton
        label={exporting ? 'Saving…' : 'Save to gallery'}
        disabled={exporting}
        onPress={() => saveToGallery().catch(() => {})}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  successBadge: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
});
