"use client";
import { signUp } from "@/lib/auth-client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const terms = formData.get("terms") as string;
      if (!terms) {
        toast.error("Please accept terms and conditions");
        return;
      }
      const { error } = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Registered successfully");
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
      <Card className="w-full  max-w-sm">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your email below to sign up to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmission}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col items-start gap-3">
                <Label htmlFor="terms">
                  <Checkbox id="terms" name="terms" /> Accept terms and conditions
                </Label>
                <p className="text-muted-foreground text-sm">
                  By clicking this checkbox, you agree to the terms and
                  conditions.
                </p>
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/auth/login")}>
              Already have an account? Login
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
