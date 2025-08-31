import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import keycloak from "./keycloak";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  // Flag to ensure we init only once
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initKeycloak = async () => {
      try {
        const isAuth = await keycloak.init({
          onLoad: "login-required",
          checkLoginIframe: false,
          pkceMethod: "S256",
          redirectUri: window.location.origin + "/sms_ui/",
        });

        setAuthenticated(isAuth);

        if (isAuth) {
          setToken(keycloak.token);

          const decoded = jwtDecode(keycloak.token);
          setDecodedToken(decoded);

          console.log("Decoded JWT:", decoded);
          // ✅ check cookies first
          const cachedUserInfo = Cookies.get("userInfo");

          if (cachedUserInfo) {
            setUserInfo(JSON.parse(cachedUserInfo));
          } else {
            // Only fetch if not cached
            const info = await keycloak.loadUserInfo();
            setUserInfo(info);
            Cookies.set("userInfo", JSON.stringify(info), {
              secure: true,
              sameSite: "strict",
            });
          }

          // Always store latest token
          Cookies.set("token", keycloak.token, {
            secure: true,
            sameSite: "strict",
          });
        } else {
          keycloak.login();
        }
      } catch (err) {
        console.error("Keycloak init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  // useEffect(() => {
  //   if (!token) return;

  //   const decoded = jwtDecode(token);
  //   const expTime = decoded.exp * 1000;
  //   const now = Date.now();

  //   if (expTime < now) {
  //     logout();
  //     return;
  //   }

  //   const timeout = expTime - now;
  //   const timer = setTimeout(() => {
  //     logout();
  //   }, timeout);

  //   return () => clearTimeout(timer);
  // }, [token]);

  // useEffect(() => {
  //   if (hasInitialized.current) return; // Prevent second init
  //   hasInitialized.current = true;

  //   keycloak
  //     .init({ onLoad: "check-sso" })
  //     .then(async (isAuth) => {
  //       setAuthenticated(isAuth);
  //       if (isAuth) {
  //         const userInfo = await keycloak.loadUserInfo();
  //         setToken(keycloak.token);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Keycloak initialization failed", error);
  //       setLoading(false);
  //     });
  // }, []);

  const login = () => keycloak.login();
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    setAuthenticated(false);
    setUserInfo(null);
    setToken(null);
    keycloak.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        login,
        logout,
        token,
        userInfo,
        loading,
        decodedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
