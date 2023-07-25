'use client';

import { HTMLAttributes, ReactNode, RefAttributes, useEffect } from 'react';

import { ButtonProps } from '@/components/ui/button';
import useHeader from '@/context/layout/header/useHeader';

type PageTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	pageTitle?: ReactNode;
	headerButtonProps?: ButtonProps & RefAttributes<HTMLButtonElement>;
};

const PageTitle = ({ className, pageTitle, headerButtonProps, ...rest }: PageTitleProps) => {

	const { setTitle, setButtonProps, title } = useHeader();

	useEffect(() => {
		setTitle(pageTitle);
		if (headerButtonProps) {
			setButtonProps(headerButtonProps);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<h1
			{ ...rest }
			className={ `hidden text-2xl font-semibold lg:flex gap-2 items-center mb-16 ${ className }` }
		>{ pageTitle || title }
		</h1>
	);
};

export default PageTitle;