import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que NÃO requerem autenticação
const publicRoutes = [
  '/',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/oauth',
  '/logout',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // Se é rota pública, permite acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verifica se há token de autenticação no cookie
  const authCookie = request.cookies.get('cortex-auth-token')

  // Se NÃO há cookie de autenticação, redireciona para login
  if (!authCookie) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
