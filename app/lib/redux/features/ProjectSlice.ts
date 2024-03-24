import { createSlice } from "@reduxjs/toolkit";

interface ProjectProps{
    projectId: string;
    shareId?: string | null;
}

const initialState:ProjectProps  = {
    projectId: '',
    shareId: null
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjectId: (state, action) => {
            state.projectId = action.payload;
        },
        setShareId: (state, action) => {
            state.shareId = action.payload;
        }
    }
});

export const { setProjectId, setShareId } = projectSlice.actions;
export default projectSlice.reducer;