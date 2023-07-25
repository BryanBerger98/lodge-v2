'use client';

import { ReactNode } from 'react';

import useTabs from './useTabs';

type TabContentProps = {
	value: string;
	children: ReactNode;
};

const TabContent = ({ value, children }: TabContentProps) => {

	const { value: activeValue } = useTabs();

	return (
		<>
			{ value === activeValue ? children : null }
		</>
	);

};

export default TabContent;