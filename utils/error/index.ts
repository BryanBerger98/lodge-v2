import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { ZodError, z } from 'zod';

import { ApiError } from '../api/error';
import { ApiErrorCode } from '../api/error/error-codes.util';

export type ValidationError = z.ZodError;

export const buildFormError = <T extends FieldValues = FieldValues>(error: ApiError<unknown>, { form, logError = true }: { logError?: boolean, form: UseFormReturn<T> }) => {
	if (logError) console.error(error);
	if (error.code === ApiErrorCode.INVALID_INPUT) {
		const { data } = error as ApiError<ZodError>;
		if (data) {
			data.issues.forEach(issue => {
				if (issue.path.join('.')) {
					form.setError(issue.path.join('.') as FieldPath<T>, { message: issue.message });
				}
			});
		}
	}
};