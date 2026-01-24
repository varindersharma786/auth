"use client";

import Link from "next/link";
import { CircleUserRound, Heart, Phone, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import MenuDrawer from "./menu-drawer";

export function SiteHeader() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { localizeLink } = useCurrency();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto flex h-20 items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href={localizeLink("/")} className="flex items-center gap-2">
          {/* Custom Intrepid Logo Icon Replica */}
          <div className="w-8 h-8 rounded-full bg-[#D40028] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M12 2C14.5 2 16 4.5 16 8C16 11.5 12 16 12 16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#D40028] tracking-tight">
            Intrepid
          </span>
        </Link>

        {/* Middle: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-zinc-700">
          <Link
            href={localizeLink("/destinations")}
            className="hover:text-[#D40028] transition-colors"
          >
            Destinations
          </Link>
          <Link
            href={localizeLink("/trip-styles")}
            className="hover:text-[#D40028] transition-colors"
          >
            Ways to travel
          </Link>
          <Link
            href={localizeLink("/deals")}
            className="hover:text-[#D40028] transition-colors"
          >
            Deals
          </Link>
          <Link
            href={localizeLink("/about")}
            className="hover:text-[#D40028] transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right: Icons (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href={localizeLink("/wishlist")}
            className="text-zinc-700 hover:text-[#D40028] transition-colors"
          >
            <Heart className="h-6 w-6 stroke-[1.5]" />
          </Link>

          <Link
            href={
              session ? localizeLink("/dashboard") : localizeLink("/auth/login")
            }
            className="text-zinc-700 hover:text-[#D40028] transition-colors"
          >
            <CircleUserRound className="h-6 w-6 stroke-[1.5]" />
          </Link>

          <Link
            href={localizeLink("/contact")}
            className="text-zinc-700 hover:text-[#D40028] transition-colors"
          >
            <Phone className="h-6 w-6 stroke-[1.5]" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-4">
          <button className="text-zinc-700">
            <Search className="h-6 w-6" />
          </button>
          <MenuDrawer />
        </div>
      </div>
    </header>
  );
}
