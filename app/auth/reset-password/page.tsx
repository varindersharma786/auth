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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@radix-ui/react-label";
import { resetPassword } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);

    const { error } = await resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Password reset successfully. Please login.");
      router.push("/auth/login");
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below to reset your password
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleResetPassword(e)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password"> New Password</Label>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroupAddon
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    align="inline-end"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
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
