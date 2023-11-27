'use client';

import { Cell, OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

import DataTable from '@/components/ui/DataTable';
import DataTableContent from '@/components/ui/DataTable/DataTableContent';
import DataTableCount from '@/components/ui/DataTable/DataTableCount';
import DataTableCustomColumns from '@/components/ui/DataTable/DataTableCustomColumns';
import DataTableNextButton from '@/components/ui/DataTable/DataTableNextButton';
import DataTablePreviousButton from '@/components/ui/DataTable/DataTablePreviousButton';
import DataTableSearch from '@/components/ui/DataTable/DataTableSearch';
import useUsers from '@/context/users/useUsers';
import useUpdateEffect from '@/hooks/utils/useUpdateEffect';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { getSortingFromURLParams } from '@/utils/table.utils';

import { COLUMN_NAMES, columns } from './columns';
import UsersDataTableActions from './UsersDataTableActions';

const UsersDataTable = () => {

	const { users, total, routeParams } = useUsers();

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

	const handleSearch = (value: string) => setSearchValue(value);
	const handleChangeSorting: OnChangeFn<SortingState> = setSorting;
	const handleChangePagination: OnChangeFn<PaginationState> = setPagination;

	const handleClickCell = (cell: Cell<IUserPopulated, unknown>) => {
		if (cell.column.id !== 'actions' && cell.column.id !== 'select') {
			router.push(`/users/${ cell.row.original.id }`);
		}
	};

	return (
		<DataTable
			columns={ columns }
			data={ users }
			pageCount={ total / pagination.pageSize }
			state={ {
				sorting,
			 	pagination,
			} }
			total={ total }
			manualPagination
			manualSorting
			onPaginationChange={ handleChangePagination }
			onSortingChange={ handleChangeSorting }
		>
			<div className="flex items-center py-4 gap-2">
				<DataTableSearch
					defaultSearchValue={ routeParams.search || '' }
					placeholder="Rechercher des clients..."
					onSearch={ handleSearch }
				/>
				<div className="flex gap-2 ml-auto">
					<UsersDataTableActions />
					<DataTableCustomColumns columnNames={ COLUMN_NAMES } />
				</div>
			</div>
			<DataTableContent
				noResultsMessage="Aucun résultat."
				onCellClick={ handleClickCell }
			/>
			<div className="flex items-center justify-between space-x-2 py-4">
				<DataTableCount />
				<div className="flex space-x-2 items-center">
					<DataTablePreviousButton />
					<DataTableNextButton />
				</div>
			</div>
		</DataTable>
	);
};

export default UsersDataTable;