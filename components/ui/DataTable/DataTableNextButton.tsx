import { MouseEventHandler, forwardRef } from 'react';

import { Button, ButtonProps } from '../button';

import useDataTable from './useDataTable';

type DataTableNextButtonProps = Omit<ButtonProps, 'asChild'>;

const DataTableNextButton = forwardRef<HTMLButtonElement, DataTableNextButtonProps>(({ variant = 'outline', size = 'sm', children = 'Next', onClick, disabled = false, ...props }, ref) => {
	const { table } = useDataTable();
    
	const handleNextPage: MouseEventHandler<HTMLButtonElement> = (event) => {
		table.nextPage();
		if (onClick) {
			onClick(event);
		}
	};

	return (
		<Button
			disabled={ !table.getCanNextPage() || disabled }
			ref={ ref }
			size={ size }
			variant={ variant }
			onClick={ handleNextPage }
			{ ...props }
		>
			{ children }
		</Button>
	);
}
);
DataTableNextButton.displayName = 'DataTableNextButton';

export default DataTableNextButton;