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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;

      const { error } = await requestPasswordReset({
        email,
      });

      if (error) {
        setError(true);
        setSuccess(false);
        toast.error(error.message || "Failed to reset password");
      } else {
        setSuccess(true);
        setError(false);
        toast.success(
          "Password reset link sent to your email. Check your inbox"
        );
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

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircleIcon />
              <AlertTitle>Failed to reset password</AlertTitle>
              <AlertDescription>Please try again later</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mt-4">
              <CheckCircle2Icon />
              <AlertTitle>Password reset link sent</AlertTitle>
              <AlertDescription>
                Check your email for the reset link
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || success}
            onClick={() => {
              const form = document.querySelector("form");
              form?.requestSubmit();
            }}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
          <CardAction>
            <p className="text-sm">
              Remember Password?{" "}
              <Link
                href="/auth/login"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Login here
              </Link>
            </p>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
