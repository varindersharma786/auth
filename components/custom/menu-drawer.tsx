import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

export default function MenuDrawer() {
  const { localizeLink } = useCurrency();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerClose />
          </div>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col justify-center space-y-4 p-4">
          <Link
            href={localizeLink("/")}
            className="text-lg font-medium hover:text-primary"
          >
            Home
          </Link>
          <Link
            href={localizeLink("/shop")}
            className="text-lg font-medium hover:text-primary"
          >
            Shop
          </Link>
          <Link
            href={localizeLink("/categories")}
            className="text-lg font-medium hover:text-primary"
          >
            Categories
          </Link>
          <Link
            href={localizeLink("/deals")}
            className="text-lg font-medium hover:text-primary"
          >
            Deals
          </Link>
          <Link
            href={localizeLink("/contact")}
            className="text-lg font-medium hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
