"use client";

import { Menu, TrendingUp } from "lucide-react";
import { useMobileNav } from "./mobile-nav-context";

interface MobileHeaderProps {
  title?: string;
}

export default function MobileHeader({ title }: MobileHeaderProps) {
  const { open } = useMobileNav();

  return (
    <header className="h-14 flex md:hidden items-center px-4 shrink-0 bg-background relative" style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.03)" }}>
      <button onClick={open} className="p-1.5 text-foreground z-10">
        <Menu className="w-5 h-5" strokeWidth={2.5} />
      </button>
      {title ? (
        <h1 className="text-sm font-semibold truncate ml-3">{title}</h1>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-foreground" strokeWidth={2.5} />
            <span className="text-sm font-semibold text-foreground">Finance AI</span>
          </div>
        </div>
      )}
    </header>
  );
}
