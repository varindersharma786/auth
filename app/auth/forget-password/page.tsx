"use client";
import { requestPasswordReset } from "@/lib/auth-client";
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

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;

      const { error } = await requestPasswordReset({
        email,
        redirectTo: "/auth/login",
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully");
        router.push("/auth/login");
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
            <CardTitle>Forget Password</CardTitle>
            <CardDescription>
              Enter your email below to reset your password
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
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/auth/login")}>
              Remember Password?
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
