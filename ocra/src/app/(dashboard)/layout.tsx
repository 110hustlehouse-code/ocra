import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar tenantName="Fulcro Lucem" />
      <main className="ml-56 p-8">{children}</main>
    </div>
  );
}
