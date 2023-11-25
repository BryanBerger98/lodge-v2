import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

type ColumnHeadSortArrowsProps = {
	column: Column<any>;
};

const ColumnHeadSortArrows = ({ column }: ColumnHeadSortArrowsProps) => {
	const sortState = column.getIsSorted();
	return sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" />;
};

export default ColumnHeadSortArrows;