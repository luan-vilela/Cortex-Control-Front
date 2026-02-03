"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Salva no store
        setAuth(user, token);

        // Redireciona para dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Erro ao processar callback OAuth:", error);
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
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
