"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthSyncProvider } from "@/components/auth-sync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <AuthSyncProvider>{children}</AuthSyncProvider>
      </Provider>
    </ClerkProvider>
  );
}
