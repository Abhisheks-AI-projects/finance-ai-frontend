import AppShell from "@/components/layout/app-shell";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell hideMobileHeader>{children}</AppShell>;
}
