import { CSRF_TOKEN_HEADER } from './csrf.util';

export type FetcherOptions = RequestInit & {
	csrfToken?: string | null;
}

const fetcher = async (input: RequestInfo | URL, options?: FetcherOptions) => {

	try {

		const response = await fetch(input, {
			...options,
			headers: {
				...options?.headers,
				[ CSRF_TOKEN_HEADER ]: options?.csrfToken || '',
			},
		});

		const data = await response.json();

		if (!response.ok) {
			throw data;
		}

		return data;
	} catch (error) {
		throw error;
	}
};

export default fetcher;