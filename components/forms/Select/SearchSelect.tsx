/* eslint-disable react/button-has-type */
import { Check, Loader2, Search } from 'lucide-react';
import { ChangeEventHandler, FocusEventHandler, ReactNode, RefAttributes } from 'react';

import { cn } from '@/utils/ui.util';

import { Button, ButtonProps } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';

export type SelectOption = {
	value: string;
	label: string;
};

type SearchSelectProps = {
	children: ReactNode;
	options: SelectOption[];
	placeholder?: string;
	notFoundText?: string;
	value: any;
	onSelect: (value: string) => void;
	debounceDelay?: number;
	onSearch?: (value: string) => void;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	isLoading?: boolean;
	onBlur?: FocusEventHandler<HTMLDivElement>;
	innerButton?: ButtonProps & RefAttributes<HTMLButtonElement> & {
		position?: 'top' | 'bottom';
	};
};

const SearchSelect = ({ children, options, placeholder, notFoundText, value, onSelect, isOpen, onOpenChange: handleOpenChange, onSearch, debounceDelay = 400, isLoading = false, onBlur: handleBlur, innerButton }: SearchSelectProps) => {

	const handleSelect = (option: SelectOption) => () => onSelect(option.value);

	let delay: NodeJS.Timeout;

	const handleClearDelay = () => {
		if (onSearch) {
			clearTimeout(delay);
		}
	};

	const handleSearchValue: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { value } = event.currentTarget;
		if (onSearch) {
			handleClearDelay();
			delay = setTimeout(() => {
				onSearch(value.trim());
			}, debounceDelay);
		}
	};

	return (
		<Popover
			open={ isOpen }
			onOpenChange={ handleOpenChange }
		>
			<PopoverTrigger
				asChild
			>
				{ children }
			</PopoverTrigger>
			<PopoverContent
				className="w-[--radix-popover-trigger-width] p-0"
				onBlur={ handleBlur }
			>
				<div className="flex items-center border-b px-3 overflow-hidden">
					<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
					<Input
						className="flex h-11 w-full rounded-none bg-transparent py-3 px-0 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 border-0"
						placeholder={ placeholder || 'Search...' }
						type="search"
						onChange={ handleSearchValue }
						onKeyDown={ handleClearDelay }
					/>
				</div>
				<div className={ `flex ${ innerButton && innerButton.position === 'bottom' ? 'flex-col-reverse' : 'flex-col' }` }>
					{
						innerButton ?
							<div className="p-2">
								<Button
									className={ `w-full items-center gap-2 ${ innerButton.className || '' }` }
									{ ...innerButton }
								/>
							</div>
							: null
					}
					<div>
						{
							isLoading || options.length === 0 ?
								<div className="flex justify-center items-center text-sm py-6 text-slate-500">{ isLoading ? <Loader2 className="animate-spin text-slate-900" /> : notFoundText || 'No option found.' }</div>
								: null
						}
						{
							!isLoading ?
								<div
									className="flex flex-col max-h-[300px] overflow-x-hidden overflow-y-auto"
									role="menu"
								>
									{ options.map((option) => (
										<Button
											key={ option.value }
											className="justify-start px-2 py-1.5 text-sm"
											role="menuitem"
											variant="ghost"
											onClick={ handleSelect(option) }
										>
											<Check
												className={ cn(
													'mr-2 h-4 w-4',
													value === option.value ? 'opacity-100' : 'opacity-0'
												) }
											/>
											{ option.label }
										</Button>
									)) }
								</div>
								: null
						}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default SearchSelect;