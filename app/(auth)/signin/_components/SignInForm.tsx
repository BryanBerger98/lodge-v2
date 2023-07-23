/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string, z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ISetting } from '@/types/setting.type';

type SignInFormProps = {
	newUserSignUpSetting: ISetting | null;
	userVerifyEmailSetting: ISetting | null;
};

const SignInForm = ({ newUserSignUpSetting, userVerifyEmailSetting }: SignInFormProps) => {

	const [ error, setError ] = useState<string | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	
	const router = useRouter();
	const searchParams = useSearchParams();
	const verificationToken = searchParams.get('verification_token');

	const signInFormSchema = object({
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		password: string().min(1, 'Required.'),
	});

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onTouched',
	});

	const handleSubmitSignInForm = (values: z.infer<typeof signInFormSchema>) => {
		setIsLoading(true);
		setError(null);
		const { email, password } = values;
		signIn('credentials', {
			redirect: false,
			email,
			password,
		})
			.then((data) => {
				if (data?.error) {
					setError('Incorrect credentials.');
				} else {
					if (userVerifyEmailSetting?.data_type === 'boolean' && userVerifyEmailSetting?.value) {
						if (verificationToken) {
							router.replace(`/verify-email/${ verificationToken }`);
						} else {
							router.replace('/verify-email');
						}
						return;
					}
					router.replace('/');
				}
			})
			.catch((error) => {
				console.error(error);
				setError('Incorrect credentials.');
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="flex flex-col gap-4 items-center">
			<Card className="min-w-[420px]">
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmitSignInForm) }>
						<CardHeader>
							<CardTitle>Sign In</CardTitle>
							<CardDescription>
								Sign in to your account.
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
									<FormItem>
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
						</CardContent>
						<CardFooter className="flex-col gap-4">
							<Button
								className="gap-2"
								disabled={ isLoading }
								type="submit"
							>
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn /> }
								Sign in
							</Button>
							<Separator orientation="horizontal" />
							<div className="flex justify-center w-full">
								{
									newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && newUserSignUpSetting.value ?
										<Button
											className="gap-2 items-center"
											variant="link"
											asChild
										>
											<Link href="/signup">
												<LogIn /> Sign Up
											</Link>
										</Button>
										: null
								}
								<Button
									className="gap-2 items-center"
									variant="link"
									asChild
								>
									<Link href="/forgot-password">
										Forgot password ?
									</Link>
								</Button>
							</div>
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

export default SignInForm;