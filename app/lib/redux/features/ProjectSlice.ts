import { createSlice } from "@reduxjs/toolkit";

interface ProjectProps{
    projectId: string;
    shareId?: string | null;
    shareLink?: string | null;
    projectAdmin?: string | null;
}

const initialState:ProjectProps  = {
    projectId: '',
    shareId: null,
    shareLink: null,
    projectAdmin: null
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
        setProjectAdmin: (state, action) => {
            state.projectAdmin = action.payload;
        }
    }
});

export const { setProjectId, setShareId, setShareIdLink, setProjectAdmin } = projectSlice.actions;
export default projectSlice.reducer;