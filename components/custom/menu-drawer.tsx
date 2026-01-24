import {
  Menu,
  X,
  ChevronRight,
  Heart,
  CircleUserRound,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { authClient } from "@/lib/auth-client";

export default function MenuDrawer() {
  const { localizeLink } = useCurrency();
  const { data: session } = authClient.useSession();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="text-zinc-700">
          <Menu className="h-6 w-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-full rounded-none w-[300px]">
        <DrawerHeader className="h-16 flex items-center justify-between border-b px-4">
          {/* Logo or Title could go here */}
          <div className="w-8 h-8 rounded-full bg-[#D40028] flex items-center justify-center">
            <span className="font-bold text-white text-xs">IT</span>
          </div>
          <DrawerClose className="p-2">
            <X className="h-6 w-6 text-zinc-500" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col py-2">
          {/* Main Links */}
          <Link
            href={localizeLink("/destinations")}
            className="flex items-center justify-between px-6 py-4 text-lg font-bold text-zinc-900 border-b border-gray-100 hover:bg-gray-50"
          >
            Destinations
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </Link>
          <Link
            href={localizeLink("/trip-styles")}
            className="flex items-center justify-between px-6 py-4 text-lg font-bold text-zinc-900 border-b border-gray-100 hover:bg-gray-50"
          >
            Ways to travel
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </Link>
          <Link
            href={localizeLink("/deals")}
            className="flex items-center justify-between px-6 py-4 text-lg font-bold text-zinc-900 border-b border-gray-100 hover:bg-gray-50"
          >
            Deals
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </Link>
          <Link
            href={localizeLink("/about")}
            className="flex items-center justify-between px-6 py-4 text-lg font-bold text-zinc-900 border-b border-gray-100 hover:bg-gray-50"
          >
            About
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </Link>

          {/* Secondary Links */}
          <div className="mt-8 px-6 space-y-6">
            <Link
              href={localizeLink("/wishlist")}
              className="flex items-center gap-4 text-zinc-700 font-medium"
            >
              <Heart className="h-6 w-6" />
              Wishlist
            </Link>
            <Link
              href={localizeLink(session ? "/bookings/manage" : "/auth/login")}
              className="flex items-center gap-4 text-zinc-700 font-medium"
            >
              <CircleUserRound className="h-6 w-6" />
              {session ? "Manage booking" : "Login / Sign up"}
            </Link>
            <Link
              href={localizeLink("/contact")}
              className="flex items-center gap-4 text-zinc-700 font-medium"
            >
              <Phone className="h-6 w-6" />
              Contact us
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
