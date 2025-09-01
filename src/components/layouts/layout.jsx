// Layout.js
import React, { useState } from "react";

import "./layout.css";
import Header from "./header/header";
import Sidebar from "./sidebar/sidebar";
import Footer from "./footer/footer";
import { useAuth } from "../../AuthContext";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  const { authenticated, login, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!authenticated ? (
        <button onClick={login}>Click to Login with Keycloak</button>
      ) : (
        <div className="jss1">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(!isSidebarOpen)}
          />
          <Header onClose={() => setSidebarOpen(false)} />
        </div>
      )}
    </>
  );
}
