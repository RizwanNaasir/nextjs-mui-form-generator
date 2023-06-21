import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware (request: NextRequest) {
    let token = request.cookies!['token']
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.rewrite(new URL('/auth/login',request.url));
    }else {
        return NextResponse.next();
    }
}