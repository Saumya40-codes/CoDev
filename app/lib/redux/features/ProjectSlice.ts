import { createSlice } from "@reduxjs/toolkit";

interface ProjectProps{
    projectId: string;
    shareId?: string | null;
    shareLink?: string | null;
    projectName: string;
}

const initialState:ProjectProps  = {
    projectId: '',
    shareId: null,
    shareLink: null,
    projectName: '',
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjectId: (state, action) => {
            state.projectId = action.payload.projectId;
        },
        setShareId: (state, action) => {
            state.shareId = action.payload;
        },
        setShareIdLink : (state, action) => {
            state.shareLink = action.payload;
        },
        setProjectName : (state, action) => {
            state.projectName = action.payload.projectName;
        },
    }
});

export const { setProjectId, setShareId, setShareIdLink, setProjectName } = projectSlice.actions;
export default projectSlice.reducer;
