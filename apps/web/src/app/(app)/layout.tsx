import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-16">
      <main className="p-4 max-w-lg mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
