import { ColumnDef, Row, RowSelectionState, Table, TableOptions, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react';

export type DataTableRowData = {
	id: string;
};

export type DataTableContextValue<TData extends DataTableRowData, TValue = unknown> = {
	table: Table<TData>;
	columns: ColumnDef<TData, TValue>[];
	total?: number;
} & Omit<TableOptions<TData>, 'getCoreRowModel'>;

export function createDataTableContext<TData extends DataTableRowData, TValue = unknown>() {
	return createContext<DataTableContextValue<TData, TValue> | null>(null);
}

export const DataTableContext = createDataTableContext<any, unknown>();

interface DataTableProps<TData extends DataTableRowData, TValue = unknown> extends Omit<TableOptions<TData>, 'getCoreRowModel' | 'getRowId'> {
	columns: ColumnDef<TData, TValue>[]
	total?: number;
	onSelectRows?: (rows: Row<TData>[]) => void;	
}

const DataTable = <TData extends DataTableRowData, TValue = unknown>({ data, columns, onSelectRows, total = 0, children, ...options }: PropsWithChildren<DataTableProps<TData, TValue>>) => {

	const [ rowSelection, setRowSelection ] = useState<RowSelectionState>({});

	const table = useReactTable<TData>({
		data,
		columns,
		getRowId: (originalRow: TData) => originalRow.id,
		...options,
		state: {
			...options.state,
			rowSelection,
		},
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel<TData>(),
		getSortedRowModel: getSortedRowModel<TData>(),
		getPaginationRowModel: getPaginationRowModel<TData>(),
		
	  });

	  useEffect(() => {
		if (onSelectRows) {
			onSelectRows(table.getSelectedRowModel().rows);
		}
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [ rowSelection ]);

	  const contextValue: DataTableContextValue<TData, TValue> = useMemo(() => ({
		table,
		columns,
		total,
		data,
		...options, 
	}), [ table, columns, options, total, data ]);

	return (
		<DataTableContext.Provider value={ contextValue }>
			{ children }
		</DataTableContext.Provider>
	);
};
DataTable.displayName = 'DataTable';

export default DataTable;