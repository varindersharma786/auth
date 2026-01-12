"use client";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function Home() {

  const { data: session } = authClient.useSession();


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-5 px-16 bg-white dark:bg-black sm:items-start">
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
