"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sendVerificationEmail, authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { data: user } = authClient.useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/auth/login");
    }
  }, [user]);

  const handleSendAgain = async () => {
    try {
      setLoading(true);
      const { error } = await sendVerificationEmail({
        email: user?.user?.email as string,
      });
      if (error) {
        setError(error.message || "Something went wrong");
      } else {
        setSuccess("Verification email sent successfully!");
      }
      setLoading(false);
    } catch (error) {
      setError((error as Error).message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full md:w-1/2">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            A verification email has been sent to your email address. Please
            check your email to verify your email address. Not received the
            email? Check your spam folder. Not received the email?{" "}
            <span
              className="text-primary ms-1 underline cursor-pointer"
              onClick={() => handleSendAgain()}
            >
              resend verification email
            </span>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-2">
          <Button onClick={() => router.push("/auth/login")} disabled={loading}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
