import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { MiddlewareFactory } from './middleware.type';


const BLACKLIST_PATHNAMES = [
	'/',
	'/users',
	'/account',
];

export const emailVerifiedMiddleware: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {

		if (BLACKLIST_PATHNAMES.includes(request.nextUrl.pathname)) {
			const tokenData = await getToken({
				req: request,
				secret: process.env.JWT_SECRET, 
			});
			
			if (!tokenData || !tokenData.has_email_verified) {
				return NextResponse.redirect(new URL('/verify-email', request.url));
			}

		}
		return next(request, _next);

	};
};