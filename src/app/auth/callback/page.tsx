"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Buscar dados do usuário com o token
      const fetchUser = async () => {
        try {
          // Salvar token temporariamente para fazer a requisição
          localStorage.setItem("token", token);

          const user = await authService.getProfile();
          setAuth(user, token);

          router.push("/dashboard");
        } catch (error) {
          console.error("Erro ao processar login OAuth:", error);
          router.push("/auth/login?error=oauth_failed");
        }
      };

      fetchUser();
    } else {
      router.push("/auth/login?error=no_token");
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processando login...</p>
      </div>
    </div>
  );
}
