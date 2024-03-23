import { createSlice } from "@reduxjs/toolkit";

interface FileProps{
    currentFile: string | null;
    currentCode: string;
    currentLanguage: string;
    fileSaved?: boolean;
}

const initialState: FileProps = {
    currentFile: null,
    currentCode: '',
    currentLanguage: '',
    fileSaved: true
}

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setCurrentFile: (state, action) => {
            state.currentFile = action.payload;
        },
        setCurrentCode: (state, action) => {
            state.currentCode = action.payload;
        },
        setCurrentLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        },
        setFileSaved: (state, action) => {
            state.fileSaved = action.payload;
        }
    }
});

export const { setCurrentFile, setCurrentCode, setCurrentLanguage, setFileSaved } = fileSlice.actions;
export default fileSlice.reducer;