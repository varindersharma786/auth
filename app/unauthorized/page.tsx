import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Unauthorized Access
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Oops! It looks like you don&apos;t have permission to access this
          page. Please contact your administrator if you believe this is a
          mistake.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            variant="default"
            size="lg"
            className="rounded-full px-8"
          >
            <Link href="/">Return Home</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            <Link href="/auth/login">Switch Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
