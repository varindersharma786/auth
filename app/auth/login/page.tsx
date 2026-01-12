"use client";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { error } = await signIn.email(
        {
          email,
          password,
          callbackURL: "/",
        },
        {
          onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token");
            localStorage.setItem("bearer_token", authToken);
          },
        }
      );

      if (error) {
        toast.error(error.message || "Failed to login");
      } else {
        toast.success("Logged in successfully");
        router.push("/");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmission}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forget-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={() => {
              const form = document.querySelector("form");
              form?.requestSubmit();
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <CardAction>
            <Button
              variant="link"
              onClick={() => router.push("/auth/register")}
            >
              Don&apos;t have an account? Sign Up
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
