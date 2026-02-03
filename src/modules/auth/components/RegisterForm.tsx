"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Chrome } from "lucide-react";
import { registerSchema, RegisterFormData } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register(data);
      setAuth(response.user, response.accessToken);

      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Erro ao criar conta. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-gh-card rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gh-text">Criar Conta</h2>
        <p className="mt-2 text-gh-text-secondary">
          Comece grátis sua jornada no Cortex Control
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nome Completo"
          type="text"
          placeholder="João Silva"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Nome da Empresa (opcional)"
          type="text"
          placeholder="Minha Empresa"
          error={errors.companyName?.message}
          {...register("companyName")}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            required
            className="w-4 h-4 text-blue-600 border-gh-border rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gh-text-secondary">
            Aceito os{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Política de Privacidade
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Criar Conta
        </Button>
      </form>

      {/* OAuth */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gh-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-xs text-gh-text-secondary bg-white">ou</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => authService.loginWithGoogle()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gh-border hover:border-gh-border hover:bg-gh-bg transition-all duration-200 group"
        >
          <Chrome className="w-4 h-4 text-gh-text-secondary group-hover:text-gh-text" />
          <span className="text-sm font-medium text-gh-text group-hover:text-gh-text">
            Google
          </span>
        </button>
        <button
          type="button"
          onClick={() => authService.loginWithFacebook()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gh-border hover:border-gh-border hover:bg-gh-bg transition-all duration-200 group"
        >
          <svg
            className="w-4 h-4 text-gh-text-secondary group-hover:text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm font-medium text-gh-text group-hover:text-blue-600">
            Facebook
          </span>
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gh-text-secondary">
          Já tem uma conta?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
