'use client';

import { MouseEventHandler, useEffect, useState } from 'react';

import { Variant } from '@/types/ui.type';

import { Button, ButtonProps } from '../button';

import useTabs from './useTabs';

type TabButtonProps = ButtonProps & {
	value: string;
	activeClassName?: (isActive: boolean) => string;
	activeVariant?: Variant;
};

const TabButton = ({ value, onClick, className, activeClassName: getActiveClassName, variant, activeVariant, ...rest }: TabButtonProps) => {

	const { setValue, value: activeValue } = useTabs();

	const [ activeClassName, setActiveClassName ] = useState('');

	useEffect(() => {
		if (getActiveClassName) {
			const className = getActiveClassName(activeValue === value);
			setActiveClassName(className);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ value, activeValue ]);

	const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
		setValue(value);
		if (onClick) {
			onClick(event);
		}
	};

	return (
		<Button
			{ ...rest }
			className={ `py-2 px-3 ${ className } ${ activeClassName }` }
			variant={ activeValue === value ? activeVariant || 'secondary' : variant || 'ghost' }
			onClick={ handleClick }
		/>
	);
};

export default TabButton;