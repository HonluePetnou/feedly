import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { BottomNav } from "@/components/dashboard/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto bg-muted/10">
          {children}
        </main>
      </div>
      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
