"use client";

import Link from "next/link";
import {
  CircleUserRound,
  Heart,
  PhoneCall,
  ShoppingCart,
  User,
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
import MenuDrawer from "./menu-drawer";
import { useCurrency } from "@/context/CurrencyContext";

export function SiteHeader() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { localizeLink } = useCurrency();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className=" mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            href={localizeLink("/")}
            className="text-xl font-bold tracking-tight"
          >
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </Link>

          {/* Navbar */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href={localizeLink("/shop")} className="hover:text-primary">
              Shop
            </Link>
            <Link
              href={localizeLink("/categories")}
              className="hover:text-primary"
            >
              Categories
            </Link>
            <Link href={localizeLink("/deals")} className="hover:text-primary">
              Deals
            </Link>
            <Link
              href={localizeLink("/contact")}
              className="hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Icons */}
        <div className=" items-center gap-2 hidden md:flex">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <CircleUserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            {session ? (
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => router.push(localizeLink("/auth/profile"))}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(localizeLink("/auth/settings"))}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => router.push(localizeLink("/auth/login"))}
                >
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(localizeLink("/auth/register"))}
                >
                  Register
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
            <PhoneCall className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex md:hidden">
          <MenuDrawer />
        </div>
      </div>
    </header>
  );
}
