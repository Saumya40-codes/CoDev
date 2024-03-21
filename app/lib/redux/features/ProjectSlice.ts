import { createSlice } from "@reduxjs/toolkit";

interface ProjectProps{
    projectId: string;
}

const initialState = {
    projectId: ''
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjectId: (state, action) => {
            state.projectId = action.payload;
        }
    }
});

export const { setProjectId } = projectSlice.actions;
export default projectSlice.reducer;