import { parse, format, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ChangeEventHandler, FocusEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { DayPickerSingleProps, SelectSingleEventHandler } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DatePickeInputProps = Omit<DayPickerSingleProps, 'mode' | 'onSelect'> & {
	onSelect?: (date: Date | undefined) => void;
	placeholder?: string;
};

let delay: NodeJS.Timeout;

const DatePickerInput = ({ onSelect, placeholder = 'DD/MM/YYYY', ...rest }: DatePickeInputProps) => {

	const [ isOpen, setIsOpen ] = useState<boolean>(false);
	const [ inputValue, setInputValue ] = useState<string>(rest.selected && isValid(rest.selected) ? format(rest.selected, 'dd/MM/yyyy') : '');
	const [ selected, setSelected ] = useState<Date | undefined>(rest.selected && isValid(rest.selected) ? rest.selected : undefined);
	const [ month, setMonth ] = useState<Date>(rest.selected && isValid(rest.selected) ? rest.selected : new Date());

	const inputRef = useRef<HTMLInputElement>(null);

	const handleClearDelay = () => {
		clearTimeout(delay);
	};

	useEffect(() => {
		delay = setTimeout(() => {
			const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
			setSelected(parsedDate);
			if (isValid(parsedDate)) {
				setMonth(parsedDate);
			}
		}, 500);
		return () => {
			handleClearDelay();
		};
	}, [ inputValue ]);

	useEffect(() => {
		if (onSelect) {
			onSelect(selected);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ selected ]);

	const handleInputClick: MouseEventHandler<HTMLInputElement> = (event) => {
		event.preventDefault();
		if (!isOpen) {
			setIsOpen(true);
		}
		inputRef.current?.focus();
	};

	const handleInputFocus: FocusEventHandler<HTMLInputElement> = () => {
		if (!isOpen) {
			setIsOpen(true);
		}
	};

	const handleOpenChanged = (newIsOpen: boolean) => setIsOpen(newIsOpen);

	const handleSelectDay: SelectSingleEventHandler = (day) => setInputValue(day ? format(day, 'dd/MM/yyyy') : '');

	const handleChangeInputValue: ChangeEventHandler<HTMLInputElement> = (event) => setInputValue(event.target.value);

	return (
		<Popover
			open={ isOpen }
			onOpenChange={ handleOpenChanged }
		>
			<PopoverTrigger asChild>
				<div
					aria-controls={ isOpen ? 'option-list' : undefined }
					className="relative"
					role="listbox"
					onClick={ handleInputClick }
				>
					<Input
						placeholder={ placeholder }
						ref={ inputRef }
						type="text"
						value={ inputValue }
						onChange={ handleChangeInputValue }
						onClick={ handleInputClick }
						onFocus={ handleInputFocus }
						onKeyDown={ handleClearDelay }
					/>
					<CalendarIcon className="absolute h-4 w-4 opacity-50 right-3 top-3 bottom-3" />
				</div>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-auto p-0"
				onOpenAutoFocus={ (event) => {
					event.preventDefault();
					inputRef.current?.focus();
				} }
			>
				<Calendar
					{ ...rest }
					mode="single"
					month={ month }
					selected={ selected }
					onMonthChange={ setMonth }
					onSelect={ handleSelectDay }
				/>
			</PopoverContent>
		</Popover>
	);
};

export default DatePickerInput;