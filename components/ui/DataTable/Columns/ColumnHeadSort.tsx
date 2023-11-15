import { Column } from '@tanstack/react-table';

import { Button, ButtonProps } from '../../button';

import ColumnHeadSortArrows from './ColumnHeadSortArrows';

type ColumnHeadSortProps = {
	column: Column<any>;	
} & ButtonProps;

const ColumnHeadSort = ({ column, children, ...props }: ColumnHeadSortProps) => {
	const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
	return (
		<Button
			variant="ghost"
			{ ...props }
			onClick={ handleSort }
		>
			{ children }
			<ColumnHeadSortArrows column={ column } />
		</Button>
	);
};

export default ColumnHeadSort;