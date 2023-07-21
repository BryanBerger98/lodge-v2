/* eslint-disable react/jsx-handler-names */
'use client';

import { Check, Loader2 } from 'lucide-react';
import * as React from 'react';

import { Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem, 
	CommandList } from '@/components/ui/command';
import { Popover,
	PopoverContent,
	PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/ui.util';

import { Input } from './input';

export type ComboOption = {
	value: string;
	label: string;
};

type ComboboxProps = {
	children: React.ReactNode;
	options: ComboOption[];
	placeholder?: string;
	notFoundText?: string;
	value: any;
	onSelect: (value: string) => void;
	debounceDelay?: number;
	onSearch?: (value: string) => void;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	isLoading?: boolean;
};

export const Combobox = ({ children, options, placeholder, notFoundText, value, onSelect: handleSelect, isOpen, onOpenChange: handleOpenChange, onSearch, debounceDelay = 400, isLoading = false }: ComboboxProps) => {

	let delay: NodeJS.Timeout;

	const handleClearDelay = () => {
		if (onSearch) {
			clearTimeout(delay);
		}
	};

	const handleSearchValue: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
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
			<PopoverTrigger asChild>
				{ children }
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput
						placeholder={ placeholder || 'Search...' }
						onKeyDown={ handleClearDelay }
						onKeyUp={ handleSearchValue }
					/>
					<CommandEmpty className="flex justify-center items-center text-sm py-6">{ isLoading ? <Loader2 className="animate-spin" /> : notFoundText || 'No option found.' }</CommandEmpty>
					<CommandList>
						{ options.map((option) => (
							<CommandItem
								key={ option.value }
								onSelect={ handleSelect }
							>
								<Check
									className={ cn(
										'mr-2 h-4 w-4',
										value === option.value ? 'opacity-100' : 'opacity-0'
									) }
								/>
								{ option.label }
							</CommandItem>
						)) }
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
