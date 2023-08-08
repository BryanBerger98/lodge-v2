import csrf from 'edge-csrf';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const CSRF_TOKEN_HEADER = 'X-CSRF-Token';

export const getCsrfToken = (headers: ReadonlyHeaders): Promise<string> => {
	return new Promise((resolve) => {
		const csrfToken = headers.get(CSRF_TOKEN_HEADER) || 'missing';
		resolve(csrfToken as string);
	});
};

export const csrfProtect = csrf({
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		sameSite: 'strict', 
	},
	token: { responseHeader: CSRF_TOKEN_HEADER },
});