"use client";
import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,     // ex: http://localhost/auth
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM, // kitbox
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID // kitbox-web
});

export async function initKeycloak() {
  if ((keycloak as any)._initialized) return keycloak;
  await keycloak.init({ onLoad: "check-sso", checkLoginIframe: false, silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" });
  (keycloak as any)._initialized = true;
  return keycloak;
}

export function authHeader() {
  if (keycloak && keycloak.token) return { Authorization: `Bearer ${keycloak.token}` };
  return {};
}