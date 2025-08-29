import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roleId: "",
  role: "",
  rolePermissions: [],
};

const RoleManagementSlice = createSlice({
  name: "roleManagement",
  initialState,
  reducers: {
    setRole: (state, action) => {
      const { role, roleId } = action.payload;
      state.role = role;
      state.roleId = roleId;
    },
    setPermissions: (state, action) => {
      const { allPermissions } = action.payload;
      state.rolePermissions = allPermissions;
    },
  },
});

export const { setRolePermissions, setRole, setPermissions } =
  RoleManagementSlice.actions;
export default RoleManagementSlice.reducer;
