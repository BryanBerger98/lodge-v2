'use client';

import { InputHTMLAttributes, KeyboardEventHandler, ReactNode, useId } from 'react';

import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InputSearchProperties = {
	inputClassName?: string;
	labelClassName?: string;
	label?: ReactNode;
	debounceDelay?: number;
	onSearch?: (value: string) => void;
} & InputProps & InputHTMLAttributes<HTMLInputElement>;

const InputSearch = ({ label = null, className = '', inputClassName = '', labelClassName = '', debounceDelay = 300, onSearch, ...fieldProps }: InputSearchProperties) => {
	
	const inputId = useId();

	let delay: NodeJS.Timeout;

	const handleClearDelay = () => {
		if (onSearch) {
			clearTimeout(delay);
		}
	};

	const handleSearchValue: KeyboardEventHandler<HTMLInputElement> = (event) => {
		const { value } = event.currentTarget;
		if (onSearch) {
			handleClearDelay();
			delay = setTimeout(() => {
				onSearch(value.trim());
			}, debounceDelay);
		}
	};

	return (
		<div className={ `flex flex-col gap-1.5 ${ className }` }>
			{
				label ?
					<Label
						className={ labelClassName }
						htmlFor={ inputId }
					>
						{ label }
					</Label>
					: null
			}
			<Input
				className={ inputClassName }
				id={ inputId }
				{ ...fieldProps }
				onKeyDown={ handleClearDelay }
				onKeyUp={ handleSearchValue }
			/>
		</div>
	);
};

export default InputSearch;