"use client";
import { verifyEmail } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function doVerification() {
      if (!token) {
        setStatus("error");
        setError("Missing verification token.");
        return;
      }

      try {
        const { error } = await verifyEmail({
          query: {
            token: token,
          },
        });

        if (error) {
          setStatus("error");
          setError(error.message || "Failed to verify email.");
          toast.error(error.message || "Failed to verify email.");
        } else {
          setStatus("success");
          toast.success("Email verified successfully!");
          // Optional: redirect after some time
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } catch (err) {
        setStatus("error");
        setError((err as Error).message);
        toast.error((err as Error).message);
      }
    }

    doVerification();
  }, [token, router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email address..."}
            {status === "success" &&
              "Your email has been successfully verified."}
            {status === "error" && "There was a problem verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-8">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-sm text-muted-foreground">
                Redirecting you to the login page in a few seconds...
              </p>
              <Button onClick={() => router.push("/auth/login")}>
                Go to Login
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-center text-sm text-destructive font-medium">
                {error}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/auth/register")}
              >
                Try Registering Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
