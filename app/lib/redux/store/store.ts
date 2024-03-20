import { configureStore } from "@reduxjs/toolkit";
import FileReducer from "../features/FileSlice";

export const store = configureStore({
    reducer: {
        file: FileReducer
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch