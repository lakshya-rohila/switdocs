import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { FileRecord } from '../../types/file';

type RecentFilesState = {
  items: FileRecord[];
};

const initialState: RecentFilesState = {
  items: [],
};

const recentFilesSlice = createSlice({
  name: 'recentFiles',
  initialState,
  reducers: {
    addRecent(state, action: PayloadAction<FileRecord>) {
      const next = [action.payload, ...state.items.filter(i => i.id !== action.payload.id)];
      state.items = next.slice(0, 500);
    },
    togglePin(state, action: PayloadAction<string>) {
      const id = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) item.pinned = !item.pinned;
    },
    removeRecent(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearRecent(state) {
      state.items = [];
    },
  },
});

export const recentFilesActions = recentFilesSlice.actions;
export const recentFilesReducer = recentFilesSlice.reducer;
