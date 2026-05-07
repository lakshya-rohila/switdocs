/**
 * AppModal — custom in-app modal replacing native Alert.alert().
 *
 * Usage (imperative, like Alert.alert):
 *   showModal({
 *     title: 'Delete file?',
 *     message: 'This cannot be undone.',
 *     buttons: [
 *       { label: 'Delete', style: 'destructive', onPress: () => doDelete() },
 *       { label: 'Cancel', style: 'cancel' },
 *     ],
 *   });
 *
 * Usage (declarative):
 *   <AppModal
 *     visible={show}
 *     title="Are you sure?"
 *     message="..."
 *     buttons={[...]}
 *     onDismiss={() => setShow(false)}
 *   />
 *
 * Also exports a singleton hook-free helper: showModal()
 * Wrap your app root with <AppModalProvider /> to enable the imperative API.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { FONT } from '../../theme/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalButton = {
  label: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

export type ModalConfig = {
  title: string;
  message?: string;
  icon?: string; // Feather icon name — optional
  buttons: ModalButton[];
};

// ─── Controlled component ─────────────────────────────────────────────────────

type AppModalProps = ModalConfig & {
  visible: boolean;
  onDismiss: () => void;
};

export function AppModal({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}: AppModalProps) {
  const { colors } = useAppTheme();

  function handleButton(btn: ModalButton) {
    onDismiss();
    btn.onPress?.();
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      {/* Scrim */}
      <Pressable style={styles.scrim} onPress={onDismiss}>
        {/* Card — stop propagation so tapping the card doesn't dismiss */}
        <Pressable style={[styles.card, { backgroundColor: colors.surface }]} onPress={() => {}}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

          {/* Message */}
          {message ? (
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          ) : null}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Buttons */}
          <View style={styles.buttons}>
            {buttons.map((btn, i) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';
              const textColor = isDestructive
                ? '#DC2626'
                : isCancel
                ? colors.textSecondary
                : colors.primary;

              return (
                <React.Fragment key={btn.label}>
                  {i > 0 && (
                    <View style={[styles.btnDivider, { backgroundColor: colors.border }]} />
                  )}
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleButton(btn)}
                    style={({ pressed }) => [
                      styles.btn,
                      pressed && { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        { color: textColor },
                        isCancel && styles.btnTextCancel,
                        isDestructive && styles.btnTextDestructive,
                      ]}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                </React.Fragment>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Imperative API via context ───────────────────────────────────────────────

type ModalContextValue = {
  showModal: (config: ModalConfig) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function AppModalProvider({ children }: { children: ReactNode }) {
  // Single state object — null means hidden, non-null means visible
  const [active, setActive] = useState<ModalConfig | null>(null);

  const showModal = useCallback((cfg: ModalConfig) => {
    // Always replace with a fresh object so React detects the change
    setActive({ ...cfg });
  }, []);

  function dismiss() {
    setActive(null);
  }

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {active !== null && (
        <AppModal
          visible
          title={active.title}
          message={active.message}
          buttons={active.buttons}
          onDismiss={dismiss}
        />
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside AppModalProvider');
  return ctx.showModal;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: FONT,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    fontFamily: FONT,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  buttons: {
    flexDirection: 'column',
  },
  btnDivider: {
    height: StyleSheet.hairlineWidth,
  },
  btn: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontFamily: FONT,
    fontWeight: '500',
  },
  btnTextCancel: {
    fontWeight: '400',
  },
  btnTextDestructive: {
    fontWeight: '600',
  },
});
