import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { generatePDF } from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ProgressOverlay } from '../../components/common/ProgressOverlay';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shareLocalFile } from '../../utils/shareOpen';
import { saveToDownloads } from '../../utils/downloader';
import { useTabBarBottomPadding } from '../../navigation/MainTabsNavigator';
import { showToast } from '../../utils/toast';
import { useFilePicker } from '../../hooks/useFilePicker';
import { useModal } from '../../components/common/AppModal';
import {
  buildHtmlFromBlocks,
  type Block,
  type BlockStyle,
  type TextBlock,
  type ImageBlock,
} from '../../services/pdf/PDFCreator';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.CREATE_PDF>;

let _idCounter = 0;
function uid() {
  _idCounter += 1;
  return `block-${Date.now()}-${_idCounter}`;
}

function makeTextBlock(style: BlockStyle = 'normal'): TextBlock {
  return { id: uid(), kind: 'text', text: '', style };
}

function makeImageBlock(uri: string): ImageBlock {
  return { id: uid(), kind: 'image', uri };
}

// ─── Formatting toolbar ───────────────────────────────────────────────────────

const FORMAT_BUTTONS: { label: string; style: BlockStyle }[] = [
  { label: '¶', style: 'normal' },
  { label: 'B', style: 'bold' },
  { label: 'H', style: 'h1' },
  { label: '•', style: 'bullet' },
];

function FormatToolbar({
  activeStyle,
  onSelect,
}: {
  activeStyle: BlockStyle;
  onSelect: (s: BlockStyle) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.toolbar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarInner}>
        {FORMAT_BUTTONS.map(btn => {
          const active = btn.style === activeStyle;
          return (
            <Pressable
              key={btn.style}
              accessibilityRole="button"
              accessibilityLabel={`Format ${btn.style}`}
              onPress={() => onSelect(btn.style)}
              style={[
                styles.toolbarBtn,
                {
                  backgroundColor: active ? colors.primary : colors.primaryLight,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[
                styles.toolbarBtnText,
                { color: active ? '#FFFFFF' : colors.textPrimary, fontWeight: btn.style === 'bold' ? '700' : '500' },
              ]}>
                {btn.label}
              </Text>
            </Pressable>
          );
        })}
        <View style={styles.toolbarDivider} />
        <Text style={[styles.toolbarHint, { color: colors.textSecondary }]}>
          Style active block
        </Text>
      </ScrollView>
    </View>
  );
}

// ─── Block row components ─────────────────────────────────────────────────────

function TextBlockRow({
  block,
  focused,
  onFocus,
  onChange,
  onRemove,
}: {
  block: TextBlock;
  focused: boolean;
  onFocus: () => void;
  onChange: (text: string) => void;
  onRemove: () => void;
}) {
  const { colors, typography } = useAppTheme();
  const placeholder =
    block.style === 'h1'
      ? 'Heading…'
      : block.style === 'bullet'
      ? 'List item (one per line)…'
      : block.style === 'bold'
      ? 'Bold paragraph…'
      : 'Start typing…';

  const textStyle =
    block.style === 'h1'
      ? [typography.h3, { color: colors.textPrimary }]
      : block.style === 'bold'
      ? [typography.body, { fontWeight: '700' as const, color: colors.textPrimary }]
      : [typography.body, { color: colors.textPrimary }];

  return (
    <View style={[styles.blockRow, focused && { borderLeftColor: colors.primary, borderLeftWidth: 2 }]}>
      <TextInput
        multiline
        value={block.text}
        onChangeText={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[textStyle, styles.textInput]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Remove block"
        onPress={onRemove}
        hitSlop={8}
        style={styles.removeBtn}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>✕</Text>
      </Pressable>
    </View>
  );
}

function ImageBlockRow({
  block,
  onRemove,
}: {
  block: ImageBlock;
  onRemove: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.imageBlockRow}>
      <Image
        source={{ uri: `file://${block.uri}` }}
        style={styles.imageBlock}
        resizeMode="cover"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Remove image"
        onPress={onRemove}
        style={[styles.imageRemoveBtn, { backgroundColor: colors.surface }]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '600' }}>✕</Text>
      </Pressable>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CreatePDFScreen({ navigation }: Props) {
  const { colors, typography } = useAppTheme();
  const tabBarPadding = useTabBarBottomPadding();
  const showModal = useModal();
  const { pickImageFromFiles } = useFilePicker();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([makeTextBlock()]);
  const [focusedId, setFocusedId] = useState<string | null>(blocks[0].id);
  const [busy, setBusy] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  // ── Block mutations ──────────────────────────────────────────────────────────

  const updateBlock = useCallback((id: string, patch: Partial<TextBlock>) => {
    setBlocks(prev =>
      prev.map(b => (b.id === id && b.kind === 'text' ? { ...b, ...patch } : b)),
    );
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      return next.length ? next : [makeTextBlock()];
    });
  }, []);

  const addTextBlock = useCallback(() => {
    const nb = makeTextBlock();
    setBlocks(prev => [...prev, nb]);
    setFocusedId(nb.id);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  }, []);

  const addImageBlock = useCallback(async () => {
    const file = await pickImageFromFiles();
    if (!file) {
      return;
    }
    const nb = makeImageBlock(file.uri);
    setBlocks(prev => [...prev, nb]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  }, [pickImageFromFiles]);

  const applyStyleToFocused = useCallback((style: BlockStyle) => {
    if (!focusedId) {
      return;
    }
    updateBlock(focusedId, { style });
  }, [focusedId, updateBlock]);

  const clearAll = useCallback(() => {
    showModal({
      title: 'Clear document',
      message: 'Remove all content? This cannot be undone.',
      buttons: [
        {
          label: 'Clear',
          style: 'destructive',
          onPress: () => {
            const nb = makeTextBlock();
            setTitle('');
            setBlocks([nb]);
            setFocusedId(nb.id);
            setSavedPath(null);
          },
        },
        { label: 'Cancel', style: 'cancel' },
      ],
    });
  }, [showModal]);

  // ── PDF generation ───────────────────────────────────────────────────────────

  async function savePdf() {
    setBusy(true);
    try {
      // Build base64 map for all image blocks
      const base64Map: Record<string, string> = {};
      for (const block of blocks) {
        if (block.kind === 'image') {
          try {
            const b64 = await RNFS.readFile(block.uri, 'base64');
            const ext = block.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
            const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
            base64Map[block.id] = `data:${mime};base64,${b64}`;
          } catch {
            // skip images that fail to read
          }
        }
      }

      const html = buildHtmlFromBlocks(title, blocks, base64Map);
      const safeName = (title.trim() || 'SwiftDocs').replace(/[^a-zA-Z0-9 _-]/g, '').slice(0, 40);
      const fileName = `${safeName}-${Date.now()}`;

      const result = await generatePDF({
        html,
        fileName,
        bgColor: '#FFFFFF',
        directory: 'docs',
      });

      const tempPath = result.filePath.startsWith('file://')
        ? result.filePath.slice(7)
        : result.filePath;

      // Copy to device Downloads so user can find it in Files / Downloads app
      const finalFileName = `${safeName}-${Date.now()}.pdf`;
      const savedDownloadPath = await saveToDownloads(tempPath, finalFileName);
      const path = savedDownloadPath ?? tempPath;

      setSavedPath(path);
      if (!savedDownloadPath) {
        showToast.success('PDF ready!', 'Tap Share to send it anywhere.');
      }
    } catch {
      showModal({ title: 'PDF error', message: 'Could not generate the PDF. Please try again.', buttons: [{ label: 'OK', style: 'cancel' }] });
    } finally {
      setBusy(false);
    }
  }

  // ── Active style for toolbar ─────────────────────────────────────────────────

  const focusedBlock = blocks.find(b => b.id === focusedId && b.kind === 'text') as TextBlock | undefined;
  const activeStyle: BlockStyle = focusedBlock?.style ?? 'normal';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ProgressOverlay visible={busy} message="Generating PDF…" />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backChevron, { color: colors.primary }]}>‹</Text>
        </Pressable>
        <Text style={[typography.h3, { flex: 1, textAlign: 'center', color: colors.textPrimary }]}>
          Create PDF
        </Text>
        <Pressable accessibilityRole="button" hitSlop={12} onPress={clearAll}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Clear</Text>
        </Pressable>
      </View>

      {/* ── Editor canvas ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.canvas}
        contentContainerStyle={[styles.canvasContent, { paddingBottom: tabBarPadding + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Document page card */}
        <View style={[styles.page, { backgroundColor: colors.surface }]}>
          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Document title"
            placeholderTextColor={colors.textSecondary}
            style={[styles.titleInput, { color: colors.textPrimary, borderBottomColor: colors.border }]}
            returnKeyType="next"
            maxLength={120}
          />

          {/* Blocks */}
          {blocks.map(block => {
            if (block.kind === 'image') {
              return (
                <ImageBlockRow
                  key={block.id}
                  block={block}
                  onRemove={() => removeBlock(block.id)}
                />
              );
            }
            return (
              <TextBlockRow
                key={block.id}
                block={block}
                focused={focusedId === block.id}
                onFocus={() => setFocusedId(block.id)}
                onChange={text => updateBlock(block.id, { text })}
                onRemove={() => removeBlock(block.id)}
              />
            );
          })}

          {/* Add block row */}
          <View style={styles.addRow}>
            <Pressable
              accessibilityRole="button"
              onPress={addTextBlock}
              style={[styles.addChip, { borderColor: colors.border, backgroundColor: colors.primaryLight }]}
            >
              <Text style={[typography.label, { color: colors.primary }]}>+ Text</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => addImageBlock().catch(() => {})}
              style={[styles.addChip, { borderColor: colors.border, backgroundColor: colors.primaryLight }]}
            >
              <Text style={[typography.label, { color: colors.primary }]}>+ Image</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ── Formatting toolbar (above keyboard) ── */}
      {focusedId != null && (
        <FormatToolbar activeStyle={activeStyle} onSelect={applyStyleToFocused} />
      )}

      {/* ── Sticky bottom bar ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: tabBarPadding }]}>
        {savedPath ? (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              shareLocalFile({ path: savedPath, mime: 'application/pdf', title: title || 'SwiftDocs.pdf' }).catch(() => {})
            }
            style={[styles.shareBtn, { borderColor: colors.primary }]}
          >
            <Text style={[typography.button, { color: colors.primary }]}>Share PDF</Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => savePdf().catch(() => {})}
          disabled={busy}
          style={[
            styles.saveBtn,
            { backgroundColor: busy ? colors.textDisabled : colors.primary },
            savedPath ? { flex: 1 } : { flex: 1 },
          ]}
        >
          <Text style={[typography.button, { color: '#FFFFFF' }]}>
            {savedPath ? 'Save again' : 'Save PDF'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
  },
  backChevron: {
    fontSize: 32,
    lineHeight: 36,
    marginRight: spacing.xxs,
  },
  canvas: {
    flex: 1,
  },
  canvasContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  page: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    gap: spacing.xs,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.1,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 0,
    paddingVertical: spacing.xxs,
    gap: spacing.xs,
  },
  textInput: {
    flex: 1,
    minHeight: 38,
    textAlignVertical: 'top',
  },
  removeBtn: {
    paddingTop: spacing.xxs + 2,
    opacity: 0.5,
  },
  imageBlockRow: {
    marginVertical: spacing.xs,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  imageBlock: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    borderRadius: radius.pill,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  addChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  toolbar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.xs,
  },
  toolbarInner: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.xs,
    alignItems: 'center',
    flexDirection: 'row',
  },
  toolbarBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarBtnText: {
    fontSize: 15,
  },
  toolbarDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: spacing.xs,
  },
  toolbarHint: {
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  shareBtn: {
    borderRadius: radius.xl,
    borderWidth: 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
