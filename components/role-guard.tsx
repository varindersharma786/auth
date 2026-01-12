"use client";
import { useSession } from "@/lib/auth-client";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return null; // Or a loading spinner
  }

  if (
    !session ||
    !allowedRoles.includes((session.user as { role: string }).role)
  ) {
    return fallback;
  }

  return <>{children}</>;
}
