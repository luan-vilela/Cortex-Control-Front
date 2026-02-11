"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { ArrowLeft, User, Mail, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-gh-card border border-gh-border rounded-lg shadow-md overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full bg-gh-card border border-gh-border p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-gh-hover flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {getUserInitials()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gh-text mb-1">
                {user?.name || "Usuário"}
              </h2>
              <p className="text-gh-text-secondary mb-4">{user?.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gh-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-gh-hover" />
                </div>
                <div>
                  <p className="text-sm text-gh-text-secondary">Email</p>
                  <p className="text-sm font-medium text-gh-text">
                    {user?.email || "não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gh-text-secondary">Função</p>
                  <p className="text-sm font-medium text-gh-text capitalize">
                    {user?.role || "member"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gh-text-secondary">Provedor</p>
                  <p className="text-sm font-medium text-gh-text capitalize">
                    {user?.provider || "local"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gh-text-secondary">Membro desde</p>
                  <p className="text-sm font-medium text-gh-text">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                      : "não informado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gh-card border border-gh-border rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gh-text mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/profile/settings")}
              className="w-full flex items-center justify-between p-4 text-left border border-gh-border rounded-lg hover:bg-gh-bg transition-colors"
            >
              <div>
                <p className="font-medium text-gh-text">Editar Informações</p>
                <p className="text-sm text-gh-text-secondary">
                  Atualize seu nome e outras informações
                </p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gh-text-secondary rotate-180" />
            </button>

            <button
              onClick={() => router.push("/profile/change-password")}
              className="w-full flex items-center justify-between p-4 text-left border border-gh-border rounded-lg hover:bg-gh-bg transition-colors"
            >
              <div>
                <p className="font-medium text-gh-text">Alterar Senha</p>
                <p className="text-sm text-gh-text-secondary">
                  Mantenha sua conta segura
                </p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gh-text-secondary rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
