'use client';

import { usePathname } from 'next/navigation';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useMemo, useState } from 'react';

import useBreakPoint from '@/hooks/utils/useBreakPoint';

type SidebarContextValue = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	brandName: string;
	logoUrl: string;
	hasSettingsAccess: boolean;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);

type SidebarProviderProps = {
	brandName: string;
	logoUrl?: string;
	hasSettingsAccess?: boolean;
}

const SidebarProvider = ({ brandName, logoUrl = '', hasSettingsAccess = false, children }: PropsWithChildren<SidebarProviderProps>) => {

	const [ isOpen, setIsOpen ] = useState(false);

	const breakPoint = useBreakPoint();
	const pathname = usePathname();

	useEffect(() => {
		if ([ 'sm', 'xs' ].includes(breakPoint.size)) {
			setIsOpen(false);
		}
	}, [ pathname, breakPoint ]);

	const contextValue = useMemo(() => ({
		isOpen,
		setIsOpen,
		brandName,
		logoUrl,
		hasSettingsAccess,
	}), [
		isOpen,
		setIsOpen,
		brandName,
		logoUrl,
		hasSettingsAccess,
	]);

	return (
		<SidebarContext.Provider value={ contextValue }>
			{ children }
		</SidebarContext.Provider>
	);
};

export default SidebarProvider;