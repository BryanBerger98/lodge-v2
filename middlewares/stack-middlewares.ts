import { NextMiddleware, NextResponse } from 'next/server';

import { MiddlewareFactory } from './middleware.type';

export const stackMiddlewares = (functions: MiddlewareFactory[] = [], index = 0, response?: NextResponse): NextMiddleware => {
	const nextResponse = response ? response : NextResponse.next();
	const current = functions[ index ];
	if (current) {
		const next = stackMiddlewares(functions, index + 1, nextResponse);
		return current(next, nextResponse);
	}
	return () => nextResponse;
};