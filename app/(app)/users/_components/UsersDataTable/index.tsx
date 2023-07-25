'use client';

import { OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import { Plus, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/data-table';
import useCsrf from '@/context/csrf/useCsrf';
import useHeader from '@/context/layout/header/useHeader';
import useUsers from '@/context/users/useUsers';
import useUpdateEffect from '@/hooks/utils/useUpdateEffect';
import { getSortingFromURLParams } from '@/utils/table.utils';

import { COLUMN_NAMES, columns } from './columns';

type UsersDataTableProps = {
	csrfToken: string;
};

const UsersDataTable = ({ csrfToken }: UsersDataTableProps) => {

	const { dispatchCsrfToken } = useCsrf();
	const { users, total, routeParams } = useUsers();

	const { setTitle, setButtonProps } = useHeader();

	useEffect(() => {
		setTitle(<><User /> Users</>);
		setButtonProps({
			asChild: true,
			className: 'gap-2 items-center',
			children: <Link href="/users/create"><Plus /></Link>,
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const router = useRouter();

	const [ sorting, setSorting ] = useState<SortingState>(getSortingFromURLParams(routeParams.sortFields, routeParams.sortDirections));
	const [ pagination, setPagination ] = useState<PaginationState>({
		pageIndex: Number(routeParams.pageIndex) || 0,
		pageSize: Number(routeParams.pageSize) || 10,
	});
	const [ searchValue, setSearchValue ] = useState('');

	useUpdateEffect(() => {
		const sortQuery = `sort_fields=${ sorting.map(el => el.id).join(',') }&sort_directions=${ sorting.map(el => el.desc ? -1 : 1).join(',') }`;
		router.push(`/users?${ sortQuery }&page_size=${ pagination.pageSize }&page_index=${ pagination.pageIndex }&search=${ searchValue }`);
	}, [ sorting, pagination, searchValue ]);

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken ]);

	const handleSearch = (value: string) => setSearchValue(value);
	const handleChangeSorting: OnChangeFn<SortingState> = setSorting;
	const handleChangePagination: OnChangeFn<PaginationState> = setPagination;

	return (
		<div>
			<DataTable
				columnNames={ COLUMN_NAMES }
				columns={ columns }
				data={ users }
				defaultSearchValue={ routeParams.search || '' }
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