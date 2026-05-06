import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

type SettingsState = {
  appearance: ThemeMode;
  defaultExportFormat: string;
  defaultSaveLocation: 'internal' | 'sd';
  conversionQualityPreset: 'low' | 'medium' | 'high';
  autoSaveConvertedFiles: boolean;
};

const initialState: SettingsState = {
  appearance: 'system',
  defaultExportFormat: 'pdf',
  defaultSaveLocation: 'internal',
  conversionQualityPreset: 'medium',
  autoSaveConvertedFiles: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAppearance(state, action: PayloadAction<ThemeMode>) {
      state.appearance = action.payload;
    },
    setDefaultExportFormat(state, action: PayloadAction<string>) {
      state.defaultExportFormat = action.payload;
    },
    setSaveLocation(state, action: PayloadAction<'internal' | 'sd'>) {
      state.defaultSaveLocation = action.payload;
    },
    setConversionQualityPreset(
      state,
      action: PayloadAction<'low' | 'medium' | 'high'>,
    ) {
      state.conversionQualityPreset = action.payload;
    },
    setAutoSaveConvertedFiles(state, action: PayloadAction<boolean>) {
      state.autoSaveConvertedFiles = action.payload;
    },
    hydrateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
