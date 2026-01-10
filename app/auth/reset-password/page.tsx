"use client";

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
import { Label } from "@radix-ui/react-label";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    if (!token) {
      toast.error("Invalid token");
      return;
    }
    setLoading(true);
    if (!password) {
      toast.error("Password is required");
      return;
    }
    const { error } = await resetPassword({
      token,
      password,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setLoading(false);
    toast.success("Password updated successfully");
    router.push("/auth/login");
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="password"
                  placeholder="New password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={loading}>
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
