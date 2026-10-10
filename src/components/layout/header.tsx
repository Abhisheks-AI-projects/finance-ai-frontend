"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/chat": "AI Chat",
  "/dashboard/transactions": "Transactions",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
