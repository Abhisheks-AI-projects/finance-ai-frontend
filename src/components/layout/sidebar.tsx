"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import {
  LayoutDashboard,
  MessageSquare,
  Receipt,
  TrendingUp,
  Plus,
  Loader2,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchThreads,
  clearThread,
} from "@/store/slices/threadSlice";
import { useAuthReady } from "@/components/auth-sync";
import { useMobileNav } from "./mobile-nav-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const authReady = useAuthReady();
  const { threads, threadsLoading } = useAppSelector(
    (state) => state.thread
  );
  const { isOpen, close } = useMobileNav();

  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (authReady && isSignedIn) {
      dispatch(fetchThreads());
    }
  }, [dispatch, authReady, isSignedIn]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    close();
  }, [pathname, close]);

  const handleNewChat = () => {
    dispatch(clearThread());
    close();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-semibold text-foreground">Finance AI</span>
        </div>
        <button onClick={close} className="md:hidden p-1 text-muted hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <Link
          href="/home"
          onClick={handleNewChat}
          className="btn-primary flex items-center gap-2 w-full !pl-3"
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          Start new chat
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-2 space-y-1 shrink-0">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {threadsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 text-muted animate-spin" />
          </div>
        ) : threads.length > 0 ? (
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2">
              Recent Chats
            </p>
            {threads.map((thread) => {
              const isActive = pathname === `/chat/${thread.thread_id}`;
              return (
                <Link
                  key={thread.thread_id}
                  href={`/chat/${thread.thread_id}`}
                  onClick={close}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <div className="truncate flex flex-col">
                    <span className="truncate">
                      {thread.title || "New Chat"}
                    </span>
                    <span className={clsx("text-[10px] font-normal", isActive ? "text-primary/60" : "text-foreground/50")}>
                      {new Date(thread.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted/50 text-center py-6">
            No chats yet
          </p>
        )}
      </div>

      {/* User */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => {
          const btn = e.currentTarget.querySelector('button');
          if (btn) btn.click();
        }}>
          <div className="shrink-0 w-10 h-10 flex items-center justify-center">
            <UserButton />
          </div>
          <span className="text-sm text-foreground font-medium truncate">{user?.fullName || user?.firstName || "Account"}</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 h-screen sticky top-0 bg-secondary flex-col" style={{ boxShadow: "1px 0 3px rgba(0,0,0,0.07)" }}>
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-secondary flex flex-col animate-[slide-in_0.2s_ease-out]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
