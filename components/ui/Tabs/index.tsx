'use client';

import { Dispatch, HTMLAttributes, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';

type TabsContextValue = {
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
} 

const TabsContext = createContext<TabsContextValue | null>(null);
export { TabsContext };

type TabsProps = {
	defaultValue: string;
	children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Tabs = ({ defaultValue, children, ...rest }: TabsProps) => {

	const [ value, setValue ] = useState<string>(defaultValue);

	const contextValue = useMemo(() => ({
		value,
		setValue, 
	}), [
		value,
	]);

	return (
		<TabsContext.Provider value={ contextValue }>
			<div
				{ ...rest }
			>
				{ children }
			</div>
		</TabsContext.Provider>
	);
};

export default Tabs;