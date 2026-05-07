import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import QRCode from 'qrcode';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCodeSvg from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';

import { GhostButton } from '../../components/common/AppHeader';
import { LabeledField } from '../../components/common/AppHeader';
import { PrimaryButton } from '../../components/common/AppHeader';
import { Segmented } from '../../components/common/AppHeader';
import { ROUTES } from '../../navigation/routes';
import type { HomeStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { shareLocalFile, shareText } from '../../utils/shareOpen';
import { ScrollScreen } from '../shared/ScrollScreen';
import { useModal } from '../../components/common/AppModal';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.QR_GENERATOR>;

const VARIANTS = ['URL', 'Text', 'Wi-Fi'] as const;

function escapeWifiPiece(value: string) {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

function wifiPayload(ssid: string, passphrase: string) {
  return `WIFI:T:WPA;S:${escapeWifiPiece(ssid || 'unset')};P:${escapeWifiPiece(passphrase)};;`;
}

export default function QRGeneratorScreen({ navigation }: Props) {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>('URL');
  const [ssid, setSsid] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [url, setUrl] = useState('https://example.com');
  const [payloadText, setPayloadText] = useState('');
  const { typography, colors } = useAppTheme();
  const showModal = useModal();

  const qrValue = useMemo(() => {
    if (variant === 'URL') {
      const trimmed = url.trim();
      return trimmed.length ? trimmed : ' ';
    }
    if (variant === 'Text') {
      return payloadText.trim().length ? payloadText.trim() : 'SwiftDocs QR';
    }
    return wifiPayload(ssid, passphrase);
  }, [ssid, passphrase, payloadText, url, variant]);

  const fields = useMemo(() => {
    if (variant === 'URL') {
      return (
        <LabeledField label="Destination" placeholder="https://swiftdocs.app" value={url} onChangeText={setUrl} />
      );
    }
    if (variant === 'Text') {
      return (
        <LabeledField
          label="Payload"
          placeholder="Promo codes, vCards, receipts"
          value={payloadText}
          onChangeText={setPayloadText}
          multiline
        />
      );
    }
    return (
      <>
        <LabeledField label="SSID" value={ssid} onChangeText={setSsid} />
        <LabeledField label="Passphrase" secureTextEntry placeholder="··········" value={passphrase} onChangeText={setPassphrase} />
      </>
    );
  }, [ssid, passphrase, variant, url, payloadText]);

  async function persistSvgArtifact() {
    try {
      const svg = await QRCode.toString(qrValue.trim().length ? qrValue.trim() : 'SwiftDocs', { type: 'svg' });
      const path = `${RNFS.DocumentDirectoryPath}/swift-qr-${Date.now()}.svg`;
      await RNFS.writeFile(path, svg, 'utf8');
      await shareLocalFile({ path, mime: 'image/svg+xml', title: 'QR export' });
    } catch {
      showModal({ title: 'Export failed', message: 'Could not save QR code.', buttons: [{ label: 'OK', style: 'cancel' }] });
    }
  }

  return (
    <ScrollScreen title="QR generator" navigation={navigation}>
      <Segmented items={[...VARIANTS]} value={variant} onChange={setVariant} />
      {fields}
      <Text style={[typography.caption]}>
        On-screen raster from react-native-qrcode-svg — vector file export uses qrcode npm.
      </Text>
      <View
        style={{
          alignSelf: 'center',
          width: '70%',
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: spacing.lg + 8,
          borderWidth: StyleSheet.hairlineWidth,
          marginVertical: spacing.md,
          paddingVertical: spacing.lg,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}>
        <QRCodeSvg value={qrValue} size={200} />
      </View>
      <PrimaryButton label="Download QR (SVG)" onPress={() => persistSvgArtifact().catch(() => {})} />
      <GhostButton
        label="Share text payload"
        onPress={() => shareText({ title: 'QR payload', message: qrValue }).catch(() => {})}
      />
    </ScrollScreen>
  );
}
