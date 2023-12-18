'use client';

import { SearchIcon } from 'lucide-react';
import { InputHTMLAttributes, KeyboardEventHandler, ReactNode, useId } from 'react';

import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/ui.util';

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
		<div className={ `flex flex-col gap-1.5 relative ${ className }` }>
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
				className={ cn('!w-full !max-w-full', inputClassName) }
				id={ inputId }
				{ ...fieldProps }
				onKeyDown={ handleClearDelay }
				onKeyUp={ handleSearchValue }
			/>
			<SearchIcon className="absolute h-4 w-4 opacity-50 right-3 top-3 bottom-3" />
		</div>
	);
};

export default InputSearch;