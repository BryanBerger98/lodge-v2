'use client';

import { ChevronRight, Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

import { cn } from '@/utils/ui.util';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	value?: ReactNode;
	valueAsDescription?: boolean;
	isLoading?: boolean;
};

const ButtonItem = forwardRef<HTMLButtonElement, ButtonProps>(({ onClick: handleClick, children, value, valueAsDescription = false, isLoading = false, disabled = false, ...rest }, ref) => {

	return (
		<button
			className={ cn('flex justify-between items-center border border-slate-200 first:rounded-t-md last:rounded-b-md text-sm py-2 px-4 hover:cursor-default [&:not(:first-child)]:-mt-[1px]', { 'hover:bg-secondary hover:cursor-pointer': handleClick }) }
			type="button"
			{ ...rest }
			disabled={ disabled || isLoading }
			ref={ ref }
			onClick={ handleClick }
		>
			<span className="flex flex-col gap-0 items-start justify-center font-medium">
				{ children }
				{ valueAsDescription && value ? <span className="text-slate-500 font-normal">{ value }</span> : null }
			</span>
			{
				isLoading ?
					<Loader2 className="h-4 w-4 animate-spin text-slate-500" />
					:
					<span className="flex gap-2 text-slate-500 items-center">
						{ !valueAsDescription && value ? <span>{ value }</span> : null }
						{ handleClick ? <ChevronRight size="16" /> : null }
					</span>
			}
		</button>
	);
});

export default ButtonItem;