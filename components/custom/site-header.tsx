"use client";

import Link from "next/link";
import {
  CircleUserRound,
  Heart,
  PhoneCall,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import MenuDrawer from "./menu-drawer";

export function SiteHeader() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { localizeLink, countryName } = useCurrency();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(localizeLink("/auth/login"));
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Top Utility Bar */}
      <div className="bg-[#2D2424] text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
              <Search className="h-3.5 w-3.5" />
              <span>Search trips...</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>1800 123 456</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={localizeLink("/wishlist")}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Heart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:text-primary transition-colors outline-none uppercase">
                  <CircleUserRound className="h-3.5 w-3.5" />
                  <span>
                    {session ? session.user.name.split(" ")[0] : "Account"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {session ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push(localizeLink("/dashboard"))}
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(localizeLink("/auth/profile"))}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push(localizeLink("/auth/login"))}
                    >
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(localizeLink("/auth/register"))
                      }
                    >
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="border-l border-white/20 pl-6 hidden md:block">
              <span className="text-white/60 mr-2">Region:</span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                {countryName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href={localizeLink("/")} className="relative w-32 h-10">
              <span className="text-2xl font-serif font-black tracking-tighter text-[#2D2424]">
                AFRICA
                <span className="text-primary font-light underline decoration-2 underline-offset-4 ml-1">
                  TOURS
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-tight text-[#2D2424]">
              <Link
                href={localizeLink("/destinations")}
                className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-px"
              >
                Destinations
              </Link>
              <Link
                href={localizeLink("/trip-styles")}
                className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-px"
              >
                Trip Styles
              </Link>
              <Link
                href={localizeLink("/tours")}
                className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-px"
              >
                Trip Search
              </Link>
              <Link
                href={localizeLink("/deals")}
                className="text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                Deals
              </Link>
              <Link
                href={localizeLink("/purpose")}
                className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-px"
              >
                Purpose
              </Link>
              <Link
                href={localizeLink("/blog")}
                className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-px"
              >
                Road Ahead
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button className="hidden md:flex rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold py-6">
              Enquire Now
            </Button>
            <div className="lg:hidden">
              <MenuDrawer />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
