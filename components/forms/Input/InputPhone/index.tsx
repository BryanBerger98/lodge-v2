import 'react-phone-number-input/style.css';
import './InputPhone.css';
import { E164Number } from 'libphonenumber-js';
import { ChangeEvent, Component, LegacyRef, forwardRef } from 'react';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import PhoneInput, { DefaultInputComponentProps, State, Props } from 'react-phone-number-input';
// import PhoneInput from 'react-phone-number-input';

type InputPhoneProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = DefaultInputComponentProps & {
	onChange: (event: string | ChangeEvent<Element>) => void;
} & ControllerRenderProps<TFieldValues, TName>

const InputPhone = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({ onChange, ...fieldProps }: InputPhoneProps<TFieldValues, TName>, ref: LegacyRef<Component<Props<DefaultInputComponentProps>, State<Props<DefaultInputComponentProps>>, any>> | undefined) => {

	const handleChange = (value?: E164Number) => {
		onChange(value || '');
	};

	return (
		<PhoneInput
			className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			defaultCountry="FR"
			onChange={ handleChange }
			{ ...fieldProps }
			ref={ ref }
		/>
	);
};

export default forwardRef(InputPhone);