import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/admin/app-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <AdminHeader />

        {children}
      </main>
    </SidebarProvider>
  );
}
