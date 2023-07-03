/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { boolean, object, string, z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const SignUpForm = () => {

	const signUpFormSchema = object({
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		password: string().min(8, 'At least 8 characters.'),
		passwordConfirm: string().min(1, 'Required'),
		termsCheck: boolean({ required_error: 'Required.' }),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: [ 'passwordConfirm' ],
		message: 'Must be the same as password.',
	});

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		mode: 'onTouched',
	});

	const handleSubmitSignUpForm = (values: z.infer<typeof signUpFormSchema>) => {
		console.log(values);
	};

	return (
		<Form { ...form }>
			<form onSubmit={ form.handleSubmit(handleSubmitSignUpForm) }>
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>
						Create an account to sign into the app.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FormField
						control={ form.control }
						name="email"
						render={ ({ field }) => (
							<FormItem className="mb-4">
								<FormLabel>Email address</FormLabel>
								<FormControl>
									<Input
										placeholder="john@doe.com"
										{ ...field }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
					<FormField
						control={ form.control }
						name="password"
						render={ ({ field }) => (
							<FormItem className="mb-4">
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										{ ...field }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
					<FormField
						control={ form.control }
						name="passwordConfirm"
						render={ ({ field }) => (
							<FormItem className="mb-4">
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<Input
										type="password"
										{ ...field }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
					<FormField
						control={ form.control }
						name="termsCheck"
						render={ ({ field }) => (
							<FormItem>
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={ field.value }
											onCheckedChange={ (state) => field.onChange(typeof state === 'boolean' ? state : false) }
										/>
									</FormControl>
									<FormLabel>Accept terms and conditions</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						) }
					/>
				</CardContent>
				<CardFooter>
					<Button
						className="gap-2 items-center"
						type="submit"
					><LogIn /> Sign Up
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
};

export default SignUpForm;