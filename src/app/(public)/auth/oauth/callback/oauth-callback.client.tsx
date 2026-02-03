"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export default function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      setAuth(user, token);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Erro ao processar callback OAuth:", error);
      router.replace("/auth/login");
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Finalizando autenticação...</p>
      </div>
    </div>
  );
}
