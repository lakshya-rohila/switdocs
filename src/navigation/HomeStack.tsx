import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CompressPDFScreen from '../screens/pdf/CompressPDFScreen';
import CreatePDFScreen from '../screens/pdf/CreatePDFScreen';
import MergePDFScreen from '../screens/pdf/MergePDFScreen';
import SplitPDFScreen from '../screens/pdf/SplitPDFScreen';
import CropImageScreen from '../screens/image/CropImageScreen';
import ImageCompressScreen from '../screens/image/ImageCompressScreen';
import ImageConverterScreen from '../screens/image/ImageConverterScreen';
import ResizeImageScreen from '../screens/image/ResizeImageScreen';
import ConverterScreen from '../screens/converter/ConverterScreen';
import ESignatureScreen from '../screens/signature/ESignatureScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/home/SearchScreen';
import QRGeneratorScreen from '../screens/qr/QRGeneratorScreen';
import QRScannerScreen from '../screens/qr/QRScannerScreen';
import WordCounterScreen from '../screens/utility/WordCounterScreen';
import { ROUTES } from './routes';
import type { HomeStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.HOME}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />
      <Stack.Screen name={ROUTES.E_SIGNATURE} component={ESignatureScreen} />
      <Stack.Screen name={ROUTES.DOCUMENT_CONVERTER} component={ConverterScreen} />
      <Stack.Screen name={ROUTES.CREATE_PDF} component={CreatePDFScreen} />
      <Stack.Screen name={ROUTES.MERGE_PDF} component={MergePDFScreen} />
      <Stack.Screen name={ROUTES.SPLIT_PDF} component={SplitPDFScreen} />
      <Stack.Screen name={ROUTES.COMPRESS_PDF} component={CompressPDFScreen} />
      <Stack.Screen name={ROUTES.IMAGE_CONVERTER} component={ImageConverterScreen} />
      <Stack.Screen name={ROUTES.IMAGE_COMPRESS} component={ImageCompressScreen} />
      <Stack.Screen name={ROUTES.IMAGE_RESIZE} component={ResizeImageScreen} />
      <Stack.Screen name={ROUTES.IMAGE_CROP} component={CropImageScreen} />
      <Stack.Screen name={ROUTES.QR_GENERATOR} component={QRGeneratorScreen} />
      <Stack.Screen name={ROUTES.QR_SCANNER} component={QRScannerScreen} />
      <Stack.Screen name={ROUTES.WORD_COUNTER} component={WordCounterScreen} />
    </Stack.Navigator>
  );
}
