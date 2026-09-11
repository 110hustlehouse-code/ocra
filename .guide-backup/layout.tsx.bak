import { Sidebar } from "@/components/layout/sidebar";
import { DemoProvider } from "@/lib/demo/store";
import { ToastProvider } from "@/components/ui/toast";
import { Guide, GuideButton } from "@/components/ui/guide";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <ToastProvider>
        <div className="min-h-screen">
          <Sidebar />
          <main className="ml-[228px]">
            <div className="max-w-[1120px] mx-auto px-8 py-7">
              {children}
            </div>
          </main>
          <Guide />
          <GuideButton />
        </div>
      </ToastProvider>
    </DemoProvider>
  );
}
