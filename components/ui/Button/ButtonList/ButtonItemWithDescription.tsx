import { ChevronRight, Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

import { cn } from '@/utils/ui.util';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	value?: ReactNode;
	description?: ReactNode;
	isLoading?: boolean;
};

const ButtonItemWithDescription = forwardRef<HTMLButtonElement, ButtonProps>(({ onClick, children, value, description, isLoading = false, disabled = false, ...rest }) => {

	return (
		<button
			className={ cn('flex justify-between items-center border border-slate-200 first:rounded-t-md last:rounded-b-md text-sm py-2 px-4 hover:cursor-default [&:not(:first-child)]:-mt-[1px]', { 'hover:bg-secondary hover:cursor-pointer': onClick }) }
			type="button"
			{ ...rest }
			disabled={ disabled || isLoading }
		>
			<span className="flex flex-col gap-0 items-start justify-center font-medium">
				{ children }
				{ description ? <span className="text-slate-500 font-normal text-xs">{ description }</span> : null }
			</span>
			{
				isLoading ?
					<Loader2 className="h-4 w-4 animate-spin text-slate-500" />
					:
					<span className="flex gap-2 text-slate-500 items-center">
						{ value ? <span>{ value }</span> : null }
						{ onClick ? <ChevronRight size="16" /> : null }
					</span>
			}
		</button>
	);
});

export default ButtonItemWithDescription;