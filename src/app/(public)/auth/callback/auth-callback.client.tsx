"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");

    if (!token) {
      router.replace("/auth/login?error=no_token");
      return;
    }

    const run = async () => {
      try {
        localStorage.setItem("token", token);
        const user = await authService.getProfile();
        setAuth(user, token);
        router.replace("/dashboard");
      } catch (err) {
        console.error("Erro OAuth:", err);
        router.replace("/auth/login?error=oauth_failed");
      }
    };

    run();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Processando login...
    </div>
  );
}
