import { ForwardRefExoticComponent, RefAttributes, forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import useHeader from './useHeader';

type HeaderButton = ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>

const HeaderButton: HeaderButton = forwardRef((props, ref) => {

	const { buttonProps } = useHeader();

	return (
		<Button
			{ ...props }
			{ ...buttonProps }
			className={ `${ props.className } ${ buttonProps?.className || '' }` }
			ref={ buttonProps?.ref || ref }
		/>
	);
});

export default HeaderButton;