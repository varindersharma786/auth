"use client";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full justify-between items-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Hello, {session.user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/auth/login")}
              >
                Login
              </Button>
              <Button size="sm" onClick={() => router.push("/auth/register")}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to the App
          </h1>
          {session && (
            <p className="text-sm text-zinc-500">
              You are logged in as{" "}
              <span className="font-bold">{(session.user as any).role}</span>
            </p>
          )}
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your secure authentication setup with Better Auth and RBAC is ready.
          </p>
        </div>
      </main>
    </div>
  );
}
