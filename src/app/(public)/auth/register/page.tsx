"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <RegisterForm />
    </div>
  );
}
