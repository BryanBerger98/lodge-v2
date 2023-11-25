import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

import InputPhone from '@/components/forms/Input/InputPhone';
import DatePickerInput from '@/components/ui/DatePicker/DatePickerInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gender } from '@/schemas/user/gender.schema';

export const UserPersonalInformationsFormBlockSchema = z.object({
	first_name: z.coerce.string({ required_error: 'Required.' }).min(1, 'Required.'),
	last_name: z.coerce.string({ required_error: 'Required.' }).min(1, 'Required.'),
	username: z.coerce.string().optional(),
	email: z.coerce.string().email('Please, provide a valid email address.').min(1, 'Required.'),
	phone_number: z.coerce.string().optional(),
	birth_date: z.coerce.date().optional(),
	gender: z.nativeEnum(Gender).default(Gender.UNSPECIFIED),
});

export type UserPersonalInformationsFormBlockValues = z.infer<typeof UserPersonalInformationsFormBlockSchema>;

const UserPersonalInformationsFormBlock = () => {

	const form = useFormContext<UserPersonalInformationsFormBlockValues>();

	return (
		<div className="space-y-4">
			<FormField
				control={ form.control }
				name="username"
				render={ ({ field }) => (
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input
								{ ...field }
								placeholder="johndoe"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				) }
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="col-span-1">
					<FormField
						control={ form.control }
						name="first_name"
						render={ ({ field }) => (
							<FormItem>
								<FormLabel>First name</FormLabel>
								<FormControl>
									<Input
										{ ...field }
										placeholder="John"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
				</div>
				<div className="col-span-1">
					<FormField
						control={ form.control }
						name="last_name"
						render={ ({ field }) => (
							<FormItem>
								<FormLabel>Last name</FormLabel>
								<FormControl>
									<Input
										{ ...field }
										placeholder="Doe"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="col-span-1">
					<FormField
						control={ form.control }
						name="email"
						render={ ({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										{ ...field }
										placeholder="example@example.com"
										type="email"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
				</div>
				<div className="col-span-1">
					<FormField
						control={ form.control }
						name="phone_number"
						render={ ({ field }) => (
							<FormItem>
								<FormLabel>Phone number</FormLabel>
								<FormControl>
									<InputPhone
										defaultCountry="FR"
										name={ field.name }
										value={ field.value }
										onBlur={ field.onBlur }
										onChange={ field.onChange }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="col-span-1">
					<FormField
						control={ form.control }
						name="birth_date"
						render={ ({ field: { onChange: handleChange, value } }) => (
							<FormItem>
								<FormLabel>Birth date</FormLabel>
								<FormControl>
									<DatePickerInput
										placeholder="DD/MM/YYYY"
										selected={ value }
										onSelect={ handleChange }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
				</div>
				<div className="col-span-1">
					<FormField
						control={ form.control }
						name="gender"
						render={ ({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select
										defaultValue={ field.value }
										onValueChange={ field.onChange }
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a gender" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={ Gender.UNSPECIFIED }>Unspecified</SelectItem>
											<SelectItem value={ Gender.MALE }>Male</SelectItem>
											<SelectItem value={ Gender.FEMALE }>Female</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
				</div>
			</div>
		</div>
	);
};

export default UserPersonalInformationsFormBlock;