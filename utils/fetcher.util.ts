import { CSRF_TOKEN_HEADER } from './csrf.util';

const fetcher = (csrfToken?: string | null) => (input: RequestInfo | URL, init?: RequestInit) => fetch(input, {
	...init,
	headers: {
		...init?.headers,
		[ CSRF_TOKEN_HEADER ]: csrfToken || '',
	},
}).then(res => res.json());

export default fetcher;