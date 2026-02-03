# Estrutura de Grupos de Rotas (Route Groups)

Este projeto foi reorganizado usando **Route Groups** do Next.js para melhor separação de responsabilidades e organização do código.

## 📁 Estrutura

```
src/app/
├── (public)/          # Rotas públicas (não autenticadas)
│   ├── layout.tsx     # Layout com visual diferenciado
│   └── auth/
│       ├── login/
│       ├── register/
│       ├── callback/
│       └── oauth/
│
├── (protected)/       # Rotas protegidas (requerem autenticação)
│   ├── layout.tsx     # Layout com verificação de autenticação
│   ├── dashboard/
│   ├── profile/
│   │   ├── change-password/
│   │   └── settings/
│   └── workspaces/
│       ├── [id]/
│       │   └── members/
│       ├── invites/
│       └── new/
│
├── layout.tsx         # Layout raiz da aplicação
├── page.tsx           # Página inicial
└── globals.css
```

## 🎯 Benefícios

### 1. **Separação Clara**

- Rotas públicas e protegidas ficam visualmente separadas
- Facilita entender quais páginas requerem autenticação

### 2. **Layouts Específicos**

- `(public)/layout.tsx`: Visual diferenciado para páginas de auth
- `(protected)/layout.tsx`: Verificação automática de autenticação

### 3. **Redução de Código Duplicado**

- A verificação de autenticação está centralizada no layout `(protected)`
- Não é mais necessário verificar `isAuthenticated` em cada página

### 4. **Melhor Manutenção**

- Mudanças em autenticação afetam apenas o layout
- Páginas individuais ficam mais simples e focadas

## 🔒 Layout Protegido

O `(protected)/layout.tsx` automaticamente:

1. ✅ Verifica se o usuário está autenticado
2. ✅ Aguarda a hidratação do estado antes de verificar
3. ✅ Redireciona para `/auth/login` se não autenticado
4. ✅ Mostra loading enquanto verifica

**Antes** (em cada página):

```tsx
export default function MyPage() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  if (!_hasHydrated || !isAuthenticated) {
    return <Loading />;
  }

  // ... resto do código
}
```

**Depois** (com route groups):

```tsx
export default function MyPage() {
  // Não precisa verificar autenticação!
  // O layout (protected) já cuida disso
  // ... código direto
}
```

## 🎨 Layout Público

O `(public)/layout.tsx` fornece:

- Visual diferenciado com gradiente
- Sem verificações de autenticação
- Ideal para login, registro, etc

## 📝 Notas Importantes

1. **Os parênteses não aparecem na URL**
   - `(protected)/dashboard` → `/dashboard`
   - `(public)/auth/login` → `/auth/login`

2. **Hierarquia de Layouts**
   - Root layout (src/app/layout.tsx)
     - Public layout (src/app/(public)/layout.tsx)
     - Protected layout (src/app/(protected)/layout.tsx)

3. **Middleware Futuro**
   - Pode-se adicionar middleware para proteção adicional
   - Route groups facilitam aplicar regras por grupo

## 🚀 Adicionando Novas Páginas

### Página Pública (sem autenticação)

```bash
# Criar em src/app/(public)/
mkdir -p src/app/(public)/minha-pagina
touch src/app/(public)/minha-pagina/page.tsx
```

### Página Protegida (com autenticação)

```bash
# Criar em src/app/(protected)/
mkdir -p src/app/(protected)/minha-pagina
touch src/app/(protected)/minha-pagina/page.tsx
```

Não precisa adicionar verificação de autenticação na nova página!

## 📚 Referências

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts)
