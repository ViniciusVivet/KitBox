"use client";
import React from "react";
import { keycloak, initKeycloak } from "@/lib/keycloak";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => { initKeycloak().then(() => setReady(true)); }, []);
  if (!ready) return null;
  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }
  return <>{children}</>;
}

export function LoginButton() {
  return <button onClick={() => keycloak.login()}>Login</button>;
}

export function LogoutButton() {
  return <button onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>Logout</button>;
}

export function useAuthHeader() {
  const [token, setToken] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    initKeycloak().then(() => {
      setToken(keycloak.token);
      keycloak.onTokenExpired = async () => {
        await keycloak.updateToken(30);
        setToken(keycloak.token);
      };
    });
  }, []);
  return token ? { Authorization: `Bearer ${token}` } : {};
}