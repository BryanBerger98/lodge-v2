import { Column } from '@tanstack/react-table';
import { ChevronDown, Settings } from 'lucide-react';
import React, { ReactNode } from 'react';

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Button } from '../button';

import useDataTable from './useDataTable';

import { DataTableRowData } from '.';

type DataTableCustomColumnsProps = {
	quickActionsMenu?: ReactNode;
	columnNames?: Record<string, string>;
}

const DataTableCustomColumns = <TData extends DataTableRowData, TValue = unknown>({ quickActionsMenu, columnNames }: DataTableCustomColumnsProps) => {

	const { table } = useDataTable<TData, TValue>();

	const handleChangeColumnDisplay = (column: Column<TData, TValue>) => (value: boolean) => column.toggleVisibility(!!value);

	return (
		<div className="flex gap-2 ml-auto">
			{ quickActionsMenu }
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
					>
						<span className="hidden lg:flex items-center">Columns <ChevronDown className="ml-2 h-4 w-4" /></span>
						<Settings
							className="lg:hidden"
							size="16"
						/>
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
									onCheckedChange={ handleChangeColumnDisplay(column as Column<TData, TValue>) }
								>
									{ (columnNames && columnNames[ column.id ]) || column.id }
								</DropdownMenuCheckboxItem>
							);
						}) }
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
DataTableCustomColumns.displayName = 'DataTableCustomColumns';

export default DataTableCustomColumns;