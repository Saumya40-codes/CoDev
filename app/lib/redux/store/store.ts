import { configureStore } from "@reduxjs/toolkit";
import FileReducer from "../features/FileSlice";
import ProjectReducer from "../features/ProjectSlice";

export const store = configureStore({
    reducer: {
        file: FileReducer,
        project: ProjectReducer
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch