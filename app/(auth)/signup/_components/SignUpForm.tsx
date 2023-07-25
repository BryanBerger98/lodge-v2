/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, boolean, object, string, z } from 'zod';

import PasswordValidationCheckList from '@/components/features/auth/PasswordValidationCheckList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signUpUser } from '@/services/auth.service';
import { ISetting } from '@/types/setting.type';
import { ApiError, getErrorMessage } from '@/utils/error';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules } from '@/utils/password.util';

type SignUpFormProperties = {
	csrfToken: string;
	userVerifyEmailSetting: ISetting | null;
	passwordRules: {
		uppercase_min: number;
		lowercase_min: number;
		numbers_min: number;
		symbols_min: number;
		min_length: number;
		should_contain_unique_chars: boolean;
	};
};

const SignUpForm = ({ csrfToken, userVerifyEmailSetting, passwordRules }: SignUpFormProperties) => {

	const [ error, setError ] = useState<string | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();

	const signUpFormSchema = object({
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		password: string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }),
		passwordConfirm: string().min(1, 'Required'),
		termsCheck: boolean({ required_error: 'Required.' }),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: [ 'passwordConfirm' ],
		message: 'Must be the same as password.',
	});

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: '',
			password: '',
			passwordConfirm: '',
			termsCheck: false,
		},
		mode: 'onTouched',
	});

	const handleSubmitSignUpForm = async (values: z.infer<typeof signUpFormSchema>) => {
		const { email, password } = values;
		setIsLoading(true);
		try {
			await signUpUser(email, password, csrfToken);
			const signInData = await signIn('credentials', {
				redirect: false,
				email,
				password,
			});
			if (signInData?.error) {
				setError('Incorrect credentials.');
			} else {
				if (userVerifyEmailSetting?.data_type === 'boolean' && userVerifyEmailSetting?.value) {
					router.replace('/verify-email');
					return;
				}
				router.replace('/');
			}
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof z.infer<typeof signUpFormSchema>;
						const [ inputName ] = issue.path;
						form.setError(inputName.toString() as IssueName, { message: issue.message });
					});
				}
			}
			setError(getErrorMessage(apiError));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 items-center">
			<Card className="min-w-[420px]">
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
										{
											field.value.length > 0 ?
												<PasswordValidationCheckList
													passwordRules={ passwordRules }
													value={ field.value }
												/>
												: null
										}
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
						<CardFooter className="flex-col gap-4">
							<Button
								className="gap-2"
								disabled={ isLoading }
								type="submit"
							>
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn /> }
								Sign up
							</Button>
							<Separator orientation="horizontal" />
							<Button
								className="gap-2 items-center"
								variant="link"
								asChild
							>
								<Link href="/signin">
									<LogIn /> Sign In
								</Link>
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
			{ error ?
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{ error }
					</AlertDescription>
				</Alert>
				: null }
		</div>
	);
};

export default SignUpForm;