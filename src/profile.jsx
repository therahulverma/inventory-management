import React from "react";
import { useKeycloak } from "@react-keycloak/web";

export default function Profile() {
  const { keycloak } = useKeycloak();

  if (!keycloak.authenticated) return <div>Not logged in</div>;

  return (
    <div>
      <h2>Welcome {keycloak.tokenParsed?.preferred_username}</h2>
      <pre>{JSON.stringify(keycloak.tokenParsed, null, 2)}</pre>
    </div>
  );
}
