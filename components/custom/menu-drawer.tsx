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

export default function MenuDrawer() {
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

        <div className="flex flex-col  justify-center space-x-2 space-y-2 p-4">
          <Link href="/" className="h-8 w-8 shrink-0 rounded-full">
            Home
          </Link>
          <Link href="/" className="h-8 w-8 shrink-0 rounded-full">
            Decrease
          </Link>
          <Link href="/" className="h-8 w-8 shrink-0 rounded-full">
            Decrease
          </Link>
          <Link href="/" className="h-8 w-8 shrink-0 rounded-full">
            Decrease
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
