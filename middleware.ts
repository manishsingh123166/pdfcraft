import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// intlMiddleware को routing के साथ सेटअप करें
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🔥 सुपर फिक्स: अगर URL में गलती से /en/ आ रहा है, तो उसे हटाकर root पर भेज दो
    if (pathname === '/en' || pathname.startsWith('/en/')) {
        const newPathname = pathname.replace(/^\/en/, '') || '/';
        const url = new URL(newPathname, request.url);
        return NextResponse.redirect(url, 301);
    }

    const response = intlMiddleware(request);

    // Required for SharedArrayBuffer (LibreOffice WASM / PDF Tools)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return response;
}

export const config = {
    // ये matcher सिर्फ ज़रूरी पेजों को पकड़ता है
    matcher: [
        '/', 
        '/(ja|ko|es|fr|de|zh|pt)/:path*', 
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ],
};
