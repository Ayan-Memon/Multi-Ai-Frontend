import { configureStore } from "@reduxjs/toolkit";
import artifactReducer from "./slices/artifact.slice";

export const store = configureStore({
  reducer: {
    artifact: artifactReducer,
  },
});
