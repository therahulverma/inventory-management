import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const PermissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    add: (state, payload) => {
      state.permissions.push(payload);
    },
  },
});

export const { add } = PermissionSlice.actions;
export default PermissionSlice.reducer;
