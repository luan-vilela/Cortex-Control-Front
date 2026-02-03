import { Suspense } from "react";
import AuthCallbackClient from "./auth-callback.client";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthCallbackClient />
    </Suspense>
  );
}
