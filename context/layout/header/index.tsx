'use client';

import { Dispatch, FC, ReactNode, RefAttributes, SetStateAction, createContext, useMemo, useState } from 'react';

import { ButtonProps } from '@/components/ui/button';

type HeaderContextValue = {
	title: ReactNode;
	setTitle: Dispatch<SetStateAction<ReactNode>>;
	buttonProps: ButtonProps & RefAttributes<HTMLButtonElement> | null;
	setButtonProps: Dispatch<SetStateAction<(ButtonProps & RefAttributes<HTMLButtonElement>) | null>>;
};

const HeaderContext = createContext<HeaderContextValue | null>(null);
export { HeaderContext };

type HeaderProviderProps = {
	children: ReactNode;
}

const HeaderProvider: FC<HeaderProviderProps> = ({ children }) => {

	const [ title, setTitle ] = useState<ReactNode>(null);
	const [ buttonProps, setButtonProps ] = useState<ButtonProps & RefAttributes<HTMLButtonElement> | null>(null);

	const contextValues = useMemo(() => ({
		title,
		setTitle,
		buttonProps,
		setButtonProps,
	}), [
		title,
		buttonProps,
	]);

	return (
		<HeaderContext.Provider value={ contextValues }>
			{ children }
		</HeaderContext.Provider>
	);
};

export default HeaderProvider;