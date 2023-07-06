import { NextFetchEvent, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { buildError, sendError } from '@/utils/error';
import { UNAUTHORIZED_ERROR } from '@/utils/error/error-codes';

import { MiddlewareFactory } from './middleware.type';


const WHITELIST_PATHNAMES = [
	'/api/auth/callback/credentials',
	'/signin',
	'/signup',
	'/forgot-password',
];

export const authMiddleware: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {

		if (!WHITELIST_PATHNAMES.includes(request.nextUrl.pathname)) {
			const tokenData = await getToken({
				req: request,
				secret: process.env.JWT_SECRET, 
			});
			
			if (!tokenData) {
				return sendError(buildError({
					message: 'Unauthorized.',
					status: 401,
					code: UNAUTHORIZED_ERROR,
				}));
			}

		}
		return next(request, _next);

	};
};