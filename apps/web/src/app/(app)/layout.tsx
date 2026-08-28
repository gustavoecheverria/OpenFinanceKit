import { BottomNav } from "@/components/layout/bottom-nav";
import { EnvBadge } from "@/components/layout/env-badge";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-16">
      <EnvBadge />
      <main className="p-4 max-w-lg mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
