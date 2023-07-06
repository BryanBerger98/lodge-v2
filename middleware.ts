import csrf from 'edge-csrf';
import { NextRequest, NextResponse } from 'next/server';

import { buildError, sendError } from './utils/error';

// initalize protection function
const csrfProtect = csrf({ cookie: { secure: process.env.NODE_ENV === 'production' } });

const WHITELIST_PATHNAMES = [
	'/api/auth/callback/credentials',
	'/api/auth/session',
];

export async function middleware(request: NextRequest) {
	if (!WHITELIST_PATHNAMES.includes(request.nextUrl.pathname)) {
		const response = NextResponse.next();

		// csrf protection
		const csrfError = await csrfProtect(request, response);

		// check result
		if (csrfError) {
			return sendError(buildError({
				message: 'Invalid CSRF token.',
				status: 403,
				code: 'invalid-csrf-token',
			}));
		}

		return response;
	}
}