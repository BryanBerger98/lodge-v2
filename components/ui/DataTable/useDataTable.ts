'use client';

import { useContext } from 'react';

import { DataTableContext, DataTableContextValue, DataTableRowData } from '.';

const useDataTable = <TData extends DataTableRowData, TValue = unknown>() => {
	const context: DataTableContextValue<TData, TValue> | null = useContext(DataTableContext);
	if (!context) {
		throw new Error('useDataTable was used outside of its Provider');
	}
	return context;
};

export default useDataTable;