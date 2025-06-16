import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    // const accessToken = request.cookies.get('lexobot_access_token')?.value;
    // const refreshToken = request.cookies.get('lexobot_refresh_token')?.value;
    // const { pathname } = request.nextUrl;

    // const publicPaths = ['/', '/login'];

    // if (publicPaths.includes(pathname)) {
    //     return NextResponse.next();
    // }

    // if (!accessToken && !refreshToken) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }

    // return NextResponse.next();
}
