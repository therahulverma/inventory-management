import React from "react";
import { useAuth } from "./AuthContext";

const FirstPage = () => {
  const { authenticated, login, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>First Page</h1>
      {!authenticated ? (
        <button onClick={login}>Click to Login with Keycloak</button>
      ) : (
        <div>
          <p>Welcome! You are authenticated.{authenticated}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default FirstPage;
