import { Cell, Row, flexRender } from '@tanstack/react-table';
import { MouseEventHandler } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import useDataTable from './useDataTable';

import { DataTableRowData } from '.';

type DataTableContentProps<TData extends DataTableRowData, TValue = unknown> = {
	noResultsMessage?: string;
	onRowClick?: (row: Row<TData>) => void;
	onCellClick?: (cell: Cell<TData, TValue>) => void;
};

const DataTableContent = <TData extends DataTableRowData, TValue = unknown>({ noResultsMessage = 'No results.', onCellClick, onRowClick }: DataTableContentProps<TData, TValue>) => {

	const { table, columns } = useDataTable<any, unknown>();

	const handleRowClick = (row: Row<TData>): MouseEventHandler<HTMLTableRowElement> => (event) => {
		if (onRowClick) {
			if ((event.target as HTMLElement).dataset.emitRowClick === 'false') {
				return;
			}
			onRowClick(row);
		}
	};

	const handleCellClick = (cell: Cell<TData, TValue>): MouseEventHandler<HTMLTableCellElement> => (event) => {
		if (onCellClick) {
			if ((event.target as HTMLElement).dataset.emitCellClick === 'false') {
				return;
			}
			onCellClick(cell);
		}
	};

	return (
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
									onClick={ handleCellClick(cell as Cell<TData, TValue>) }
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
	);
};
DataTableContent.displayName = 'DataTableContent';

export default DataTableContent;