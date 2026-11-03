import { createSlice } from "@reduxjs/toolkit";

export const artifactSlice = createSlice({
  name: `artifact`,
  initialState: [],
  reducers: {
    setArtifacts: (state, action) => action.payload,
    addArtifact: (state, action) => [...state, action.payload],
    removeArtifact: () => [],
  },
});

export const { setArtifacts, addArtifact, removeArtifact } =
  artifactSlice.actions;

export default artifactSlice.reducer;
