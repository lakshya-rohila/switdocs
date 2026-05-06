import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type ConversionStatus = 'idle' | 'sharing' | 'done' | 'error';

export type ConversionState = {
  status: ConversionStatus;
  progress: number;
  errorMessage?: string;
};

const initialState: ConversionState = {
  status: 'idle',
  progress: 0,
};

const conversionSlice = createSlice({
  name: 'conversion',
  initialState,
  reducers: {
    resetConversion() {
      return initialState;
    },
    setStatus(state, action: PayloadAction<ConversionStatus>) {
      state.status = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.errorMessage = action.payload;
      state.status = 'error';
    },
  },
});

export const conversionActions = conversionSlice.actions;
export const conversionReducer = conversionSlice.reducer;
