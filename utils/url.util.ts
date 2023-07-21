import { URLSearchParams } from 'url';

export const getRedirectURLWithSearchParams = (path: string, searchParams: URLSearchParams) => {
	const queryParams: string[] = [];
	searchParams.forEach((value, key) => {
		queryParams.push(`${ key }=${ value }`);
	});
	return `/${ path }${ queryParams.length > 0 ? `?${ queryParams.join('&') }` : '' }`;
};

export const buildQueryUrl = (params: Record<string, string | number | undefined | null>) => {
	return '?' + Object.entries(params).map(([ key, value ]) => {
		if (key && value) {
			return `${ key }=${ value }`;
		}
		return '';
	}).filter(param => param).join('&');
};