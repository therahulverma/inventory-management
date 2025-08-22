import Keycloak from "keycloak-js";

console.log("IP:", process.env.REACT_APP_IP_ADDRESS);

const keycloak = new Keycloak({
  url: `${process.env.REACT_APP_IP_ADDRESS}:8080/`,
  realm: "vijay-demo",
  clientId: "vijay-spa",
});

export default keycloak;
