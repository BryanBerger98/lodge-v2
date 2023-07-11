import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

import useUsers from '@/context/users/useUsers';
import { IUser } from '@/types/user.type';
import fetcher from '@/utils/fetcher.util';

type FetchUsersResponse = {
	users: IUser[],
	count: number,
	total: number,
};

const useFetchUsers = () => {

	const { setUsersState, setLoadingState } = useUsers();

	const searchParams = useSearchParams();
	const sortFields = searchParams.get('sort_fields');
	const sortDirections = searchParams.get('sort_directions');
	const pageIndex = searchParams.get('page_index');
	const pageSize = searchParams.get('page_size');
	const search = searchParams.get('search');

	const formattedPageSize = Number(pageSize) || 10;
	const formattedPageIndex = Number(pageIndex) || 0;

	const queryString = `?sort_fields=${ sortFields || '' }&sort_directions=${ sortDirections || '' }&page_size=${ formattedPageSize }&page_index=${ formattedPageIndex }&search=${ search || '' }`;

	const { data, error, isLoading, mutate } = useSWR<FetchUsersResponse>(`/api/users${ queryString }`, fetcher);

	useEffect(() => {
		if (isLoading) {
			setLoadingState('pending');
		}
		if (error) {
			console.error(error);
			setLoadingState('error', error.message);
		}
		if (data) {
			setUsersState({
				users: data.users,
				total: data.total,
			});
			setLoadingState('idle');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isLoading, error, data ]);

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