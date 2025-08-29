import { combineReducers } from "@reduxjs/toolkit";
import permissionReducer from "./slices/permissionSlice.js";
import roleManagement from "./slices/roleManagementSlice.js";

const rootReducer = combineReducers({
  permissions: permissionReducer,
  roleManagement: roleManagement,
});

export default rootReducer;
