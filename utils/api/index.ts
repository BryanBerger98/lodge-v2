import { NextRequest, NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/database';

import { sendApiError } from './error';

export type ApiHandler = (request: NextRequest, context: { params: { [key: string]: string } }) => Promise<NextResponse> | NextResponse;

export const routeHandler = (handler: ApiHandler) => async (request: NextRequest, { params }: { params: { [key: string]: string } }): Promise<NextResponse> => {
	try {
		await connectToDatabase();
		const response = await handler(request, { params });
		return response;
	} catch (error) {
		console.error(error);
		return sendApiError(error);
	}
};