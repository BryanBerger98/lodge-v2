import { VariantProps } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/utils/ui.util';

import { paragraphVariants } from '../Typography/text';

import useDataTable from './useDataTable';


const DataTableCount = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof paragraphVariants>>(({ className, variant, ...props }, ref) => {

	const { total } = useDataTable();

	return total !== undefined ? (
		<p
			{ ...props }
			className={ cn('px-4', paragraphVariants({ variant }), className) }
			ref={ ref }
		>
			{ total } Entit{ total > 1 ? 'ies' : 'y' } 
		</p>
	) : null;
});
DataTableCount.displayName = 'DataTableCount';

export default DataTableCount;