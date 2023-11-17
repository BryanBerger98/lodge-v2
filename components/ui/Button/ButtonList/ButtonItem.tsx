'use client';

import { ChevronRight, Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

import { cn } from '@/utils/ui.util';


export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	value?: ReactNode;
	valueAsDescription?: boolean;
	isLoading?: boolean;
	variant?: 'default' | 'destructive';
	rightIcon?: ReactNode;
};

const ButtonItem = forwardRef<HTMLButtonElement, ButtonProps>(({ onClick: handleClick, children, value, valueAsDescription = false, isLoading = false, disabled = false, className, variant = 'default', rightIcon, ...rest }, ref) => {

	return (
		<button
			className={ cn('group flex justify-between items-center border border-slate-200 first:rounded-t-md last:rounded-b-md text-sm py-2 px-4 hover:cursor-default [&:not(:first-child)]:-mt-[1px] disabled:pointer-event-none disabled:cursor-default disabled:hover:!bg-transparent', { 'hover:bg-secondary hover:cursor-pointer': handleClick }, className) }
			type="button"
			{ ...rest }
			disabled={ disabled || isLoading }
			ref={ ref }
			onClick={ handleClick }
		>
			<span
				className={ cn(
					'flex flex-col gap-0 items-start justify-center font-medium',
					{
						'opacity-50': disabled,
						'text-destructive': variant === 'destructive', 
					}
				) }
			>
				{ children }
				{ valueAsDescription && value ? <span className="text-slate-500 font-normal">{ value }</span> : null }
			</span>
			{
				isLoading ?
					<Loader2
						className={ cn('h-4 w-4 animate-spin text-slate-500', { 'opacity-50': disabled }) }
					/>
					:
					<span
						className={ cn('flex gap-2 items-center justify-center text-slate-500', { 'opacity-50': disabled }) }
					>
						{ !valueAsDescription && value ? <span>{ value }</span> : null }
						{ rightIcon ? rightIcon : handleClick && !disabled ? <ChevronRight size="16" /> : null }
					</span>
			}
		</button>
	);
});

export default ButtonItem;