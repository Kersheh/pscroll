import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileSelectState {
  folderOptions: Array<string>;
  selectedFolders: Array<string>;
}

const initialState: FileSelectState = {
  folderOptions: [],
  selectedFolders: []
};

const fileSelectSlice = createSlice({
  name: 'fileSelect',
  initialState,
  reducers: {
    setFolderOptionsAction: (draft, action: PayloadAction<Array<string>>) => {
      draft.folderOptions = action.payload;
    },
    selectFolderAction: (draft, action: PayloadAction<Array<string>>) => {
      draft.selectedFolders = action.payload;
    }
  }
});

export const { setFolderOptionsAction, selectFolderAction } = fileSelectSlice.actions;

export default fileSelectSlice.reducer;
