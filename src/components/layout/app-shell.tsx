"use client";

import Sidebar from "./sidebar";
import MobileHeader from "./mobile-header";
import { MobileNavProvider } from "./mobile-nav-context";

interface AppShellProps {
  children: React.ReactNode;
  mobileTitle?: string;
  hideMobileHeader?: boolean;
}

export default function AppShell({ children, mobileTitle, hideMobileHeader }: AppShellProps) {
  return (
    <MobileNavProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 overflow-auto">
          {!hideMobileHeader && <MobileHeader title={mobileTitle} />}
          {children}
        </main>
      </div>
    </MobileNavProvider>
  );
}
