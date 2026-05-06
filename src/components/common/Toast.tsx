import React from 'react';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { Colors, FontSize, Radius, Spacing } from '../../theme/tokens';
import { rs, rf } from '../../utils/responsive';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: Colors.success,
        borderLeftWidth: rs(5),
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        marginHorizontal: Spacing.base,
        minHeight: rs(60),
        elevation: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: Spacing.base }}
      text1Style={{
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
      }}
      text2Style={{
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: Colors.error,
        borderLeftWidth: rs(5),
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        marginHorizontal: Spacing.base,
        minHeight: rs(60),
        elevation: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: Spacing.base }}
      text1Style={{
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
      }}
      text2Style={{
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: Colors.primary,
        borderLeftWidth: rs(5),
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        marginHorizontal: Spacing.base,
        minHeight: rs(60),
        elevation: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: Spacing.base }}
      text1Style={{
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
      }}
      text2Style={{
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
      }}
    />
  ),
};

export default Toast;
