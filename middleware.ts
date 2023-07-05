import csrf from 'edge-csrf';
import { NextRequest, NextResponse } from 'next/server';

import { buildError, sendError } from './utils/error.util';

// initalize protection function
const csrfProtect = csrf({ cookie: { secure: process.env.NODE_ENV === 'production' } });

const WHITELIST_PATHNAMES = [
	'/api/auth/callback/credentials',
];

export async function middleware(request: NextRequest) {
	if (!WHITELIST_PATHNAMES.includes(request.nextUrl.pathname)) {
		const response = NextResponse.next();

		// csrf protection
		const csrfError = await csrfProtect(request, response);

		// check result
		if (csrfError) {
		// return new NextResponse('invalid csrf token', { status: 403 });
			return sendError(buildError({
				message: 'Invalid CSRF token.',
				status: 403,
			}));
		}
    
		return response;
	}
}