import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

import { StatusCode, getReasonPhrase } from '../http-status';

import { ApiErrorCode } from './error-codes.util';
import { getErrorMessage } from './error-messages.util';

export type ValidationError = z.ZodError;

export const ApiErrorSchema = z.object({
	code: z.nativeEnum(ApiErrorCode).optional(),
	message: z.string().optional(),
	status: z.nativeEnum(StatusCode).optional(),
	data: z.any().nullable().optional(),
});

export type ApiError<D = unknown> = z.infer<typeof ApiErrorSchema> & {
	data?: D | null;
};

export const buildApiError = <D = unknown>(apiError: ApiError<D>): ApiError<D> => ({
	...apiError,
	message: apiError.message || getErrorMessage(apiError.code || apiError.status || StatusCode.INTERNAL_SERVER_ERROR),
	status: apiError.status || StatusCode.INTERNAL_SERVER_ERROR,
});

export const sendApiError = (error: any) => {
	if (error.name && error.name === 'ZodError') {
		const zodError = buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: getErrorMessage(ApiErrorCode.INVALID_INPUT),
			status: StatusCode.UNPROCESSABLE_ENTITY,
			data: error as ZodError,
		});
		return NextResponse.json(zodError, {
			status: StatusCode.UNPROCESSABLE_ENTITY,
			statusText: getReasonPhrase(StatusCode.UNPROCESSABLE_ENTITY),
		});
	}
	const parsedError = ApiErrorSchema.safeParse(error);
	if (parsedError.success) {
		return NextResponse.json(parsedError.data, {
			status: parsedError.data.status,
			statusText: getReasonPhrase(parsedError.data.status || StatusCode.INTERNAL_SERVER_ERROR), 
		});
	}
	return NextResponse.json(error, {
		status: StatusCode.INTERNAL_SERVER_ERROR,
		statusText: getReasonPhrase(StatusCode.INTERNAL_SERVER_ERROR), 
	});
};