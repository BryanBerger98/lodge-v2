import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { IUserPopulated } from '@/types/user.type';

export type FetchUsersResponse = {
	users: IUserPopulated[],
	count: number,
	total: number,
};

export type UseFetchUsersOptions = {
	sortFields?: string[],
	sortDirections?: string[],
	pageIndex?: number,
	pageSize?: number,
	search? : string,
}

const useFetchUsers = (options?: UseFetchUsersOptions) => {

	const searchParams = useSearchParams();
	const sortFields = options?.sortFields?.join(',') || searchParams.get('sort_fields');
	const sortDirections = options?.sortDirections?.join(',') || searchParams.get('sort_directions');
	const pageIndex = options?.pageIndex !== undefined ? options.pageIndex : Number(searchParams.get('page_index'));
	const pageSize = options?.pageSize !== undefined ? options.pageSize : Number(searchParams.get('page_size'));
	const search = options?.search || searchParams.get('search');

	const queryString = `?sort_fields=${ sortFields || '' }&sort_directions=${ sortDirections || '' }&page_size=${ !isNaN(pageSize) && pageSize > 0 ? pageSize : 10 }&page_index=${ !isNaN(pageIndex) ? pageIndex : 0 }&search=${ search || '' }`;

	const { data, error, isLoading, mutate } = useSWR<FetchUsersResponse>(`/api/users${ queryString }`, fetcher);

	return {
		data,
		error,
		isLoading,
		refetch: mutate,
		routeParams: {
			sortFields,
			sortDirections,
			pageIndex,
			pageSize,
			search,
		},
	};

};

export default useFetchUsers;