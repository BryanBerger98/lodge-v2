'use client';

import { OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/data-table';
import useCsrf from '@/context/csrf/useCsrf';
import useUsers from '@/context/users/useUsers';
import useFetchUsers from '@/hooks/users/useFetchUsers';
import useUpdateEffect from '@/hooks/utils/useUpdateEffect';
import { fetchUsers } from '@/services/users.service';
import { getSortingFromURLParams } from '@/utils/table.utils';

import { columns } from './columns';

type UsersDataTableProps = {
	csrfToken: string;
};

const UsersDataTable = ({ csrfToken }: UsersDataTableProps) => {

	const { dispatchCsrfToken } = useCsrf();
	const { users, total, setUsersState } = useUsers();
	const { routeParams } = useFetchUsers();

	// const [ usersList, setUsersList ] = useState<IUser[]>(users);
	const router = useRouter();

	const [ sorting, setSorting ] = useState<SortingState>(getSortingFromURLParams(routeParams.sortFields, routeParams.sortDirections));
	const [ pagination, setPagination ] = useState<PaginationState>({
		pageIndex: Number(routeParams.pageIndex) || 0,
		pageSize: Number(routeParams.pageSize) || 10,
	});
	const [ searchValue, setSearchValue ] = useState(routeParams.search || '');

	// TODO > Fetch does not work on changing page

	const handleChangeSorting: OnChangeFn<SortingState> = setSorting;
	const handleChangePagination: OnChangeFn<PaginationState> = setPagination;

	useUpdateEffect(() => {
		const sortQuery = `sort_fields=${ sorting.map(el => el.id).join(',') }&sort_directions=${ sorting.map(el => el.desc ? -1 : 1).join(',') }`;
		router.push(`/users?${ sortQuery }&page_size${ pagination.pageSize }&page_index${ pagination.pageIndex }&search=${ searchValue }`);
	}, [ sorting, pagination, searchValue ]);

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken ]);

	// useUpdateEffect(() => {
	// 	fetchUsers({
	// 		sort: sorting,
	// 		limit: pagination.pageSize,
	// 		skip: Math.round(pagination.pageIndex * pagination.pageSize),
	// 		search: searchValue,
	// 		cache: 'no-store',
	// 	})
	// 		.then(({ total, users }) => {
	// 			setUsersState({
	// 				users,
	// 				total,
	// 			});
	// 		})
	// 		.catch(console.error);
	// }, [ sorting, pagination, searchValue ]);

	const handleSearch = (value: string) => setSearchValue(value);

	return (
		<div>
			<DataTable
				columns={ columns }
				data={ users }
				pageCount={ total / pagination.pageSize }
				searchPlaceholder="Search users..."
				state={ {
					sorting,
					pagination,
				} }
				total={ total }
				manualPagination
				manualSorting
				withCustomColumns
				withSearch
				onPaginationChange={ handleChangePagination }
				onSearch={ handleSearch }
				onSortingChange={ handleChangeSorting }
			/>
		</div>
	);
};

export default UsersDataTable;