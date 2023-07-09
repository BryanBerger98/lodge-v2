import 'react-phone-number-input/style.css';
import './InputPhone.css';
import { E164Number } from 'libphonenumber-js';
import { ChangeEvent, Component, LegacyRef, forwardRef } from 'react';
import PhoneInput, { DefaultInputComponentProps, Props, State } from 'react-phone-number-input';

type InputPhoneProps = DefaultInputComponentProps & {
	onChange: (event: string | ChangeEvent<Element>) => void;
}

const InputPhone = ({ onChange, ...fieldProps }: InputPhoneProps, ref: LegacyRef<Component<Props<DefaultInputComponentProps>, State<Props<DefaultInputComponentProps>>, any>> | undefined) => {

	const handleChange = (value?: E164Number) => {
		onChange(value || '');
	};

	return (
		<PhoneInput
			className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			defaultCountry="FR"
			ref={ ref }
			onChange={ handleChange }
			{ ...fieldProps }
		/>
	);
};

export default forwardRef(InputPhone);