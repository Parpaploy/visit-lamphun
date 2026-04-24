import { configureStore } from "@reduxjs/toolkit";
import webstateSlice from "./slices/webstate-slice";

export const store = configureStore({
  reducer: {
    webstateSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
