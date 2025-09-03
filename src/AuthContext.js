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

  const isTokenValid = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      const expTime = decoded.exp * 1000; // ms
      return Date.now() < expTime;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        const cachedToken = Cookies.get("token");
        const cachedUserInfo = Cookies.get("userInfo");

        // ✅ If token exists and still valid → use it
        if (cachedToken && isTokenValid(cachedToken)) {
          setToken(cachedToken);
          setDecodedToken(jwtDecode(cachedToken));
          setAuthenticated(true);

          if (cachedUserInfo) {
            setUserInfo(JSON.parse(cachedUserInfo));
          } else {
            const info = await keycloak.loadUserInfo();
            setUserInfo(info);
            Cookies.set("userInfo", JSON.stringify(info), {
              secure: true,
              sameSite: "strict",
            });
          }
          setLoading(false);
          return;
        }

        // ❌ Otherwise → fresh login with Keycloak
        const isAuth = await keycloak.init({
          onLoad: "login-required",
          checkLoginIframe: false,
          pkceMethod: "S256",
          redirectUri: window.location.origin + "/sms_ui/",
        });

        setAuthenticated(isAuth);

        if (isAuth) {
          const newToken = keycloak.token;
          setToken(newToken);

          const decoded = jwtDecode(newToken);
          setDecodedToken(decoded);

          const info = await keycloak.loadUserInfo();
          setUserInfo(info);

          // save latest token + info
          Cookies.set("token", newToken, { secure: true, sameSite: "strict" });
          Cookies.set("userInfo", JSON.stringify(info), {
            secure: true,
            sameSite: "strict",
          });
        } else {
          keycloak.login();
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
