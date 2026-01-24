"use client";

import {
  Settings,
  LogOut,
  CreditCard,
  Calendar1,
  Route,
  Users,
  LayoutDashboard,
  ChevronRight,
  User,
  Map,
  Book,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import { Separator } from "../ui/separator";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
    url: "/admin/users",
  },
  {
    title: "Destinations",
    icon: Map,
    url: "/admin/destinations",
  },
  {
    title: "Tours",
    icon: Route,
    children: [
      { title: "All Tours", url: "/admin/tours" },
      { title: "Categories", url: "/admin/tours/categories" },
    ],
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Calendar1,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "articles",
    url: "/admin/articles",
    icon: Book,
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export default function AppSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/auth/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* ───────── HEADER ───────── */}
      <SidebarHeader className="flex gap-2 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
          A
        </div>
        <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
          Ajay Tools
        </span>
      </SidebarHeader>

      {/* <Separator /> */}

      {/* ───────── CONTENT ───────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard Menu</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const hasChildren = !!item.children;

                return (
                  <SidebarMenuItem key={item.title}>
                    {/* Parent */}
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() =>
                        hasChildren
                          ? setOpen(open === item.title ? null : item.title)
                          : router.push(item.url!)
                      }
                    >
                      <item.icon className="h-4 w-4" />

                      <span className="group-data-[collapsible=icon]:hidden flex-1">
                        {item.title}
                      </span>

                      {hasChildren && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden ${
                            open === item.title ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </SidebarMenuButton>

                    {/* Sub Menu */}
                    {hasChildren && open === item.title && (
                      <SidebarMenuSub>
                        {item.children.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              onClick={() => router.push(sub.url)}
                            >
                              {sub.title}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="w-[90%] mx-auto">
        <Separator />
      </div>

      {/* ───────── FOOTER ───────── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
