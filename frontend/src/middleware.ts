import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Routes qui nécessitent une authentification admin
const protectedRoutes = ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/users', '/admin/testimonials', '/admin/settings'];

// Routes publiques (ne nécessitent pas d'authentification)
const publicRoutes = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si c'est une route publique, continuer
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si c'est une route protégée, vérifier l'authentification
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Rediriger vers la page de login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Vérifier que c'est un admin
      if (decoded.role !== 'admin') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Ajouter les informations utilisateur aux headers pour les routes API
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.userId.toString());
      response.headers.set('x-user-role', decoded.role);
      
      return response;
    } catch (error) {
      // Token invalide, rediriger vers login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Pour toutes les autres routes, continuer normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
