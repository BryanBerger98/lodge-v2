import { URLSearchParams } from 'url';

export const getRedirectURLWithSearchParams = (path: string, searchParams: URLSearchParams) => {
	const queryParams: string[] = [];
	searchParams.forEach((value, key) => {
		queryParams.push(`${ key }=${ value }`);
	});
	return `/${ path }${ queryParams.length > 0 ? `?${ queryParams.join('&') }` : '' }`;
};