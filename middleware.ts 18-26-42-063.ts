import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface MiddlewareRequest extends NextRequest {
    headers: Headers;
}

export function middleware(request: MiddlewareRequest) {
    // Check if the request is using HTTP
    if (request.headers.get('x-forwarded-proto') !== 'https') {
        // Get the original URL but replace http with https
        const httpsUrl = request.url.replace('http://', 'https://');
        return NextResponse.redirect(httpsUrl, 301);
    }
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};