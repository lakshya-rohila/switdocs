import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import SignatureCanvas, { type SignatureViewRef } from 'react-native-signature-canvas';

export type DrawingSignatureHandle = {
  clear: () => void;
  /** Triggers `onSignatureDataUrl` asynchronously when strokes exist. */
  read: () => void;
};

type Props = {
  onSignatureDataUrl: (dataUrl: string) => void;
  onEmpty?: () => void;
  height?: number;
};

/**
 * Stroke capture backed by `react-native-signature-canvas` (requires `react-native-webview`).
 */
export const DrawingSignatureCanvas = forwardRef<DrawingSignatureHandle, Props>(
  ({ onSignatureDataUrl, onEmpty, height = 220 }, ref) => {
    const canvasRef = useRef<SignatureViewRef | null>(null);

    const webStyle = useMemo(
      () =>
        `.m-signature-pad{border:none;box-sizing:border-box}body,html{margin:0;background:#fff}canvas{width:100%;height:${height}px;border-radius:12px;touch-action:none}`,
      [height],
    );

    useImperativeHandle(
      ref,
      () => ({
        clear: () => canvasRef.current?.clearSignature(),
        read: () => canvasRef.current?.readSignature(),
      }),
      [],
    );

    return (
      <View style={[styles.box, { minHeight: height }]}>
        <SignatureCanvas
          ref={canvasRef}
          nestedScrollEnabled
          backgroundColor="#FFFFFF"
          webStyle={webStyle}
          onOK={(sig: string) => onSignatureDataUrl(sig)}
          onEmpty={() => onEmpty?.()}
          imageType="image/png"
        />
      </View>
    );
  },
);

DrawingSignatureCanvas.displayName = 'DrawingSignatureCanvas';

const styles = StyleSheet.create({
  box: {
    borderRadius: 16,
    overflow: 'hidden',
    borderStyle: 'dashed',
    borderWidth: StyleSheet.hairlineWidth + 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
});
