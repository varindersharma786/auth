import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/admin/app-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
