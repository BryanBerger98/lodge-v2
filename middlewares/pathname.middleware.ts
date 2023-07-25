import { NextFetchEvent, NextRequest } from 'next/server';

import { MiddlewareFactory } from './middleware.type';


const BLACKLIST_PATHNAMES = [
	'/api',
	'/_next/static',
	'/_next/image',
	'/favicon.ico',
];

export const pathnameMiddleware: MiddlewareFactory = (next, response) => {
	return (request: NextRequest, _next: NextFetchEvent) => {

		if (!BLACKLIST_PATHNAMES.includes(request.nextUrl.pathname)) {
			response.headers.set('x-pathname', request.nextUrl.pathname);
		}
		return next(request, _next);

	};
};