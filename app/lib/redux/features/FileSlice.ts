import { createSlice } from "@reduxjs/toolkit";

interface FileProps{
    currentFile: string;
    currentCode: string;
    currentLanguage: string;
}

const initialState: FileProps = {
    currentFile: '',
    currentCode: '',
    currentLanguage: ''
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
        }
    }
});

export const { setCurrentFile, setCurrentCode, setCurrentLanguage } = fileSlice.actions;
export default fileSlice.reducer;