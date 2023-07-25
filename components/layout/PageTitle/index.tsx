'use client';

import { HTMLAttributes, RefAttributes, useEffect } from 'react';

import { ButtonProps } from '@/components/ui/button';
import useHeader from '@/context/layout/header/useHeader';

type PageTitleProps = HTMLAttributes<HTMLHeadingElement> & {
	headerButton?: ButtonProps & RefAttributes<HTMLButtonElement>;
};

const PageTitle = ({ className, children, headerButton, ...rest }: PageTitleProps) => {

	const { setTitle, setButtonProps } = useHeader();

	useEffect(() => {
		setTitle(children);
		setButtonProps(headerButton || null);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<h1
			{ ...rest }
			className={ `hidden text-2xl font-semibold md:flex gap-2 items-center mb-16 ${ className || '' }` }
		>{ children }
		</h1>
	);
};

export default PageTitle;