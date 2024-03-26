import { createSlice } from "@reduxjs/toolkit";

interface ProjectProps{
    projectAdmin: string;
    projectId: string;
    shareId?: string | null;
}

const initialState:ProjectProps  = {
    projectAdmin: '',
    projectId: '',
    shareId: null
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjectId: (state, action) => {
            state.projectId = action.payload.projectId;
            state.projectAdmin = action.payload.user;
        },
        setShareId: (state, action) => {
            state.shareId = action.payload;
        }
    }
});

export const { setProjectId, setShareId } = projectSlice.actions;
export default projectSlice.reducer;