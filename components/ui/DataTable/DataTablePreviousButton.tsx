import { MouseEventHandler, forwardRef } from 'react';

import { Button, ButtonProps } from '../button';

import useDataTable from './useDataTable';

type DataTablePreviousButtonProps = Omit<ButtonProps, 'asChild'>;

const DataTablePreviousButton = forwardRef<HTMLButtonElement, DataTablePreviousButtonProps>(({ variant = 'outline', size = 'sm', children = 'Previous', onClick, disabled = false, ...props }, ref) => {
	const { table } = useDataTable();
    
	const handlePreviousPage: MouseEventHandler<HTMLButtonElement> = (event) => {
		table.previousPage();
		if (onClick) {
			onClick(event);
		}
	};

	return (
		<Button
			disabled={ !table.getCanPreviousPage() || disabled }
			ref={ ref }
			size={ size }
			variant={ variant }
			onClick={ handlePreviousPage }
			{ ...props }
		>
			{ children }
		</Button>
	);
}
);
DataTablePreviousButton.displayName = 'DataTablePreviousButton';

export default DataTablePreviousButton;