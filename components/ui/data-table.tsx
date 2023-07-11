'use client';

import { ColumnDef, useReactTable, getCoreRowModel, flexRender, TableOptions, getSortedRowModel, getPaginationRowModel, Column } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import InputSearch from '../forms/inputs/InputSearch';

import { Button } from './button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

interface DataTableProps<TData, TValue> extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	withSearch?: boolean;
	total?: number;
	onSearch?: (value: string) => void;
	searchPlaceholder?: string;
	withCustomColumns?: boolean;
}

const DataTable = <TData, TValue>({ columns, data, withSearch = false, total = 0, onSearch: handleSearch, searchPlaceholder, withCustomColumns = false, ...options }: DataTableProps<TData, TValue>) => {

	const table = useReactTable({
		data,
		columns,
		...options,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	  });
	
	  const handleChangeColumnDisplay = (column: Column<TData, unknown>) => (value: boolean) => column.toggleVisibility(!!value);

	return (
		<>
			<div className="flex items-center py-4">
				{
					withSearch ?
						<InputSearch
							className="flex-grow"
							inputClassName="max-w-sm"
							placeholder={ searchPlaceholder || 'Search...' }
							onSearch={ handleSearch }
						/>
						: null
				}
				{
					withCustomColumns ?
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									className="ml-auto"
									variant="outline"
								>
									Columns <ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{ table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={ column.id }
												checked={ column.getIsVisible() }
												className="capitalize"
												onCheckedChange={ handleChangeColumnDisplay(column) }
											>
												{ column.id }
											</DropdownMenuCheckboxItem>
										);
									}) }
							</DropdownMenuContent>
						</DropdownMenu>
						: null
				}
			</div>
			<Table>
				<TableHeader>
					{ table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={ headerGroup.id }>
							{ headerGroup.headers.map((header) => {
								return (
									<TableHead key={ header.id }>
										{ header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											) }
									</TableHead>
								);
							}) }
						</TableRow>
					)) }
				</TableHeader>
				<TableBody>
					{ table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={ row.id }
								data-state={ row.getIsSelected() && 'selected' }
							>
								{ row.getVisibleCells().map((cell) => (
									<TableCell key={ cell.id }>
										{ flexRender(cell.column.columnDef.cell, cell.getContext()) }
									</TableCell>
								)) }
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								className="h-24 text-center"
								colSpan={ columns.length }
							>
								No results.
							</TableCell>
						</TableRow>
					) }
				</TableBody>
			</Table>
			<div className="flex items-center justify-between space-x-2 py-4">
				{
					total ?
						<div className="px-4 text-base">
							{ total } Entit{ total > 1 ? 'ies' : 'y' } 
						</div>
						: null
				}
				<div className="flex space-x-2 items-center">
					<Button
						disabled={ !table.getCanPreviousPage() }
						size="sm"
						variant="outline"
						onClick={ () => table.previousPage() }
					>
						Previous
					</Button>
					<Button
						disabled={ !table.getCanNextPage() }
						size="sm"
						variant="outline"
						onClick={ () => table.nextPage() }
					>
						Next
					</Button>
				</div>
			</div>
		</>
	);
};

export default DataTable;