'use client';

import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';

import { Button, ButtonProps } from '../button';

const BackButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> = forwardRef(({ children, className = '', ...rest }, ref) => {

	const router = useRouter();

	const handleGoBack = () => router.back();

	return (
		<Button
			className={ `gap-2 items-center mb-4 ${ className }` }
			variant="outline"
			{ ...rest }
			ref={ ref }
			role="link"
			onClick={ handleGoBack }
		>
			{ children }
		</Button>
	);
});

export default BackButton;