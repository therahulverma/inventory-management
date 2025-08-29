// RoleContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { decodedToken } = useAuth();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (
      decodedToken?.realm_access?.roles &&
      decodedToken.realm_access.roles.length > 0
    ) {
      setRole(decodedToken.realm_access.roles[0]);
    }
  }, [decodedToken]);

  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, handleChangeRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook for easy usage
export const useRole = () => useContext(RoleContext);
