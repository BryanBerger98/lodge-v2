// middleware/withLogging.ts
import csrf from 'edge-csrf';
import { NextFetchEvent, NextRequest } from 'next/server';

import { buildError, sendError } from '@/utils/error';

import { MiddlewareFactory } from './middleware.type';

const WHITELIST_PATHNAMES = [
	'/api/auth/callback/credentials',
	'/api/auth/callback/email',
	'/api/auth/callback/google',
	'/api/auth/session',
	'/api/auth/signout',
	'/api/auth/signin/email',
	'/api/auth/signin/google',
	'/api/auth/_log',
];

const csrfProtect = csrf({ cookie: { secure: process.env.NODE_ENV === 'production' } });

export const csrfMiddleware: MiddlewareFactory = (next, response) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {

		if (!WHITELIST_PATHNAMES.includes(request.nextUrl.pathname)) {
	
			const csrfError = await csrfProtect(request, response);
	
			if (csrfError) {
				return sendError(buildError({
					message: 'Invalid CSRF token.',
					status: 403,
					code: 'invalid-csrf-token',
					data: csrfError,
				}));
			}
		}
		return next(request, _next);

	};
};
