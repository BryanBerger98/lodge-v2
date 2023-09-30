import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

import { DEFAULT_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR } from './error-codes';
import { errorMessages } from './error-messages';

export type ValidationError = z.ZodError;

export type ApiError<D> = {
	code: string;
	message: string;
	status?: number;
	data?: D | null;
}

export const buildError = <D>(apiError: ApiError<D>): ApiError<D> => {
	return {
		...apiError,
		status: apiError.status || 500,
	};
};

export const sendError = (error: any) => {
	const errorObj = {
		...error,
		status: error?.status || 500,
	};
	return NextResponse.json(errorObj, { status: errorObj.status });
};

export const getErrorMessage = <D>(apiError: ApiError<D>, options?: { locale: 'fr' | 'en' }) => {
	return errorMessages[ apiError.code || DEFAULT_ERROR ][ options?.locale || 'en' ] || errorMessages[ DEFAULT_ERROR ][ options?.locale || 'en' ];
};

export const sendBuiltError = (error: any) => {
	return sendError(buildError({
		code: error.code || INTERNAL_ERROR,
		message: error.message || 'An error occured.',
		status: 500,
		data: error,
	}));
};

export const sendBuiltErrorWithSchemaValidation = (error: any) => {
	if (error.name && error.name === 'ZodError') {
		return sendError(buildError({
			code: INVALID_INPUT_ERROR,
			message: 'Invalid input.',
			status: 422,
			data: error as ZodError,
		}));
	}
	return sendError(buildError({
		code: error.code || INTERNAL_ERROR,
		message: error.message || 'An error occured.',
		status: error.status || 500,
		data: error,
	}));
};