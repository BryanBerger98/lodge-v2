import { ReactNode, RefAttributes, useContext } from 'react';

import { ButtonProps } from '@/components/ui/button';

import { HeaderContext } from '.';

export type HeaderOptions = {
	title?: ReactNode,
	buttonProps?: ButtonProps & RefAttributes<HTMLButtonElement>,
};

const useHeader = () => {
	const context = useContext(HeaderContext);
	if (context === null) {
		throw new Error('useHeader is null');
	}
	if (context === undefined) {
		throw new Error('useHeader was used outside of its Provider');
	}
	return context;
};

export default useHeader;