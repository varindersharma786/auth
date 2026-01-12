"use client";

import Link from "next/link";
import { Heart, ShoppingCart, User } from "lucide-react";
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
import ThemeSwitcher from "./theme-switcher";

export function SiteHeader() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
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
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
          <Link href="/deals" className="hover:text-primary">
            Deals
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            {session ? (
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/auth/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/auth/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/auth/login")}>
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/auth/register")}>
                  Register
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {/* Cart badge */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              2
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
