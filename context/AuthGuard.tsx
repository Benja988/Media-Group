"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(ROUTES.LOGIN);
      } else if (!["admin", "editor"].includes(user.role)) {
        router.push(ROUTES.HOME); // Redirect unauthorized users to home instead of 403
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  return <>{children}</>;
}
