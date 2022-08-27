import { configureStore } from '@reduxjs/toolkit';
import fileSelectReducer from '../components/FileSelectMenu/sliceReducer';

const store = configureStore({
  reducer: {
    fileSelect: fileSelectReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
