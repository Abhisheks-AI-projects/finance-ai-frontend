"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useAuth } from "@clerk/nextjs";
import { setTokenGetter } from "@/lib/api";

const AuthReadyContext = createContext(false);

export function useAuthReady() {
  return useContext(AuthReadyContext);
}

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setTokenGetter(() => getToken());
      setAuthReady(true);
    } else if (isLoaded && !isSignedIn) {
      setAuthReady(true);
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <AuthReadyContext.Provider value={authReady}>
      {children}
    </AuthReadyContext.Provider>
  );
}
