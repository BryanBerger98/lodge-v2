'use client';

import { ColumnDef, useReactTable, getCoreRowModel, flexRender, TableOptions, getSortedRowModel, getPaginationRowModel, Column, Row, Cell } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from './button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

const DynamicInputSearch = dynamic(() => import('../forms/Input/InputSearch'), { ssr: false });

interface DataTableProps<TData, TValue> extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	withSearch?: boolean;
	total?: number;
	onSearch?: (value: string) => void;
	searchPlaceholder?: string;
	withCustomColumns?: boolean;
	defaultSearchValue?: string;
	columnNames?: Record<string, string>;
	noResultsMessage?: string;
	onRowClick?: (row: Row<TData>) => void;
	onCellClick?: (row: Cell<TData, unknown>) => void;
}

const DataTable = <TData, TValue>({ columns, columnNames, data, withSearch = false, defaultSearchValue = '', total = 0, onSearch: handleSearch, searchPlaceholder, withCustomColumns = false, noResultsMessage = 'No results.', onRowClick, onCellClick, ...options }: DataTableProps<TData, TValue>) => {

	const table = useReactTable({
		data,
		columns,
		...options,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	  });
	
	  const handleChangeColumnDisplay = (column: Column<TData, unknown>) => (value: boolean) => column.toggleVisibility(!!value);

	  const handleNextPage = () => table.nextPage();
	  const handlePreviousPage = () => table.previousPage();

	  const handleRowClick = (row: Row<TData>) => () => {
		if (onRowClick) {
			onRowClick(row);
		}
	  };

	  const handleCellClick = (cell: Cell<TData, unknown>) => () => {
		if (onCellClick) {
			onCellClick(cell);
		}
	  };

	return (
		<>
			<div className="flex items-center py-4">
				{
					withSearch ?
						<DynamicInputSearch
							className="flex-grow"
							defaultValue={ defaultSearchValue }
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
												{ (columnNames && columnNames[ column.id ]) || column.id }
											</DropdownMenuCheckboxItem>
										);
									}) }
							</DropdownMenuContent>
						</DropdownMenu>
						: null
				}
			</div>
			<Table className="overflow-x-scroll w-full relative">
				<TableHeader>
					{ table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={ headerGroup.id }>
							{ headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={ header.id }
										align={ (header.column.columnDef.meta as any)?.header?.align }
									>
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
								className={ onRowClick ? 'hover:cursor-pointer' : '' }
								data-state={ row.getIsSelected() && 'selected' }
								onClick={ handleRowClick(row) }
							>
								{ row.getVisibleCells().map((cell) => (
									<TableCell
										key={ cell.id }
										align={ (cell.column.columnDef.meta as any)?.cell?.align }
										className={ onCellClick ? 'hover:cursor-pointer' : '' }
										onClick={ handleCellClick(cell) }
									>
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
								{ noResultsMessage }
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
						onClick={ handlePreviousPage }
					>
						Previous
					</Button>
					<Button
						disabled={ !table.getCanNextPage() }
						size="sm"
						variant="outline"
						onClick={ handleNextPage }
					>
						Next
					</Button>
				</div>
			</div>
		</>
	);
};

export default DataTable;