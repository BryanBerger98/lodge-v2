'use client';

import { OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/data-table';
import useCsrf from '@/context/csrf/useCsrf';
import useUpdateEffect from '@/hooks/utils/useUpdateEffect';
import { fetchUsers } from '@/services/users.service';
import { IUser } from '@/types/user.type';

import { columns } from './columns';

type UsersDataTableProps = {
	users: IUser[];
	total: number;
	csrfToken: string;
};

const UsersDataTable = ({ users, total, csrfToken }: UsersDataTableProps) => {

	const { dispatchCsrfToken } = useCsrf();

	const [ usersList, setUsersList ] = useState<IUser[]>(users);
	const [ usersTotal, setUsersTotal ] = useState<number>(total);

	const [ sorting, setSorting ] = useState<SortingState>([]);
	const [ pagination, setPagination ] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [ searchValue, setSearchValue ] = useState('');

	const handleChangeSorting: OnChangeFn<SortingState> = setSorting;
	const handleChangePagination: OnChangeFn<PaginationState> = setPagination;

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken ]);

	useUpdateEffect(() => {
		fetchUsers({
			sort: sorting,
			limit: pagination.pageSize,
			skip: Math.round(pagination.pageIndex * pagination.pageSize),
			search: searchValue,
			cache: 'no-store',
		})
			.then(({ total, users }) => {
				setUsersTotal(total);
				setUsersList(users);
			})
			.catch(console.error);
	}, [ sorting, pagination, searchValue ]);

	const handleSearch = (value: string) => setSearchValue(value);

	return (
		<div>
			<DataTable
				columns={ columns }
				data={ usersList }
				pageCount={ usersTotal / pagination.pageSize }
				searchPlaceholder="Search users..."
				state={ {
					sorting,
					pagination,
				} }
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