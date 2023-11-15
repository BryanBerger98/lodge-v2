import { CSRF_TOKEN_HEADER } from './csrf';

export type FetcherOptions = RequestInit & {
	csrfToken?: string | null;
}

export type FetcherOptionsWithCsrf = FetcherOptions & {
	csrfToken: string;
};

const fetcher = async <Data = unknown>(input: RequestInfo | URL, options?: FetcherOptions | FetcherOptionsWithCsrf): Promise<Data> => {

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

		return data as Data;
	} catch (error) {
		throw error;
	}
};

export default fetcher;