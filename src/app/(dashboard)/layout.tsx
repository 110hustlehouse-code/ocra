import { Sidebar } from "@/components/layout/sidebar";
import { DemoProvider } from "@/lib/demo/store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <div className="min-h-screen">
        <Sidebar />
        <main className="ml-[228px] px-8 py-7 max-w-[1440px]">{children}</main>
      </div>
    </DemoProvider>
  );
}
