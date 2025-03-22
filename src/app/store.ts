import { Action, configureStore } from '@reduxjs/toolkit';
import { outlayApi } from '@/api/outlayApi';

export const store = configureStore({
  reducer: { 
    [outlayApi.reducerPath]: outlayApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(outlayApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
