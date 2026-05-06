import { configureStore } from '@reduxjs/toolkit';
import { conversionReducer } from './slices/conversionSlice';
import { recentFilesReducer } from './slices/recentFilesSlice';
import { settingsReducer } from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    recentFiles: recentFilesReducer,
    conversion: conversionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
