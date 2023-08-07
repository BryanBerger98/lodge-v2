/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ISetting, UnregisteredSetting } from '@/types/setting.type';

import AppleAuthButton from '../../_components/ProvidersButtons/AppleAuthButton';
import GoogleAuthButton from '../../_components/ProvidersButtons/GoogleAuthButton';

import { useSignInContext } from './SignInCard';

type EmailSignInFormProps = {
	newUserSignUpSetting: ISetting | UnregisteredSetting | null;
	googleAuthSetting: ISetting | UnregisteredSetting | null;
	appleAuthSetting: ISetting | UnregisteredSetting | null;
};

const EmailSignInForm = ({ newUserSignUpSetting, googleAuthSetting, appleAuthSetting } :EmailSignInFormProps) => {
	
	const { isLoading, step, setStep, setEmail, email } = useSignInContext();

	const emailSignInFormSchema = z.object({ email: z.string().email('Please, provide a valid email address.').min(1, 'Required.') });

	const form = useForm<z.infer<typeof emailSignInFormSchema>>({
		resolver: zodResolver(emailSignInFormSchema),
		defaultValues: { email: email || '' },
		mode: 'onTouched',
	});

	const handleSubmitEmailSignInForm = (values: z.infer<typeof emailSignInFormSchema>) => {
		setEmail(values.email);
		setStep('password');
	};

	if (step !== 'email') {
		return null;
	}

	const areProvidersEnabled =
		(googleAuthSetting && googleAuthSetting.data_type === 'boolean' && googleAuthSetting.value)
		|| (appleAuthSetting && appleAuthSetting.data_type === 'boolean' && appleAuthSetting.value);

	return (
		<Form { ...form }>
			<form onSubmit={ form.handleSubmit(handleSubmitEmailSignInForm) }>
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>
						Sign in to your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{
						areProvidersEnabled ?
							<>
								<div className="flex flex-col gap-4 mb-4">
									{ googleAuthSetting && googleAuthSetting.data_type === 'boolean' && googleAuthSetting.value ? <GoogleAuthButton /> : null }
									{ appleAuthSetting && appleAuthSetting.data_type === 'boolean' && appleAuthSetting.value ? <AppleAuthButton /> : null }
								</div>
								<div className="flex gap-4 items-center justify-center w-full mb-2">
									<Separator
										className="flex-1"
										orientation="horizontal"
									/>
									<p className="text-sm text-slate-500 m-0">OR</p>
									<Separator
										className="flex-1"
										orientation="horizontal"
									/>
								</div>
							</>
							: null
					}
					<FormField
						control={ form.control }
						name="email"
						render={ ({ field }) => (
							<FormItem>
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
				</CardContent>
				<CardFooter className="flex-col gap-4">
					<Button
						className="gap-2"
						disabled={ isLoading }
						type="submit"
					>
						Continue
						{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight size="16" /> }
					</Button>
					{
						(newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && newUserSignUpSetting.value) || !newUserSignUpSetting ?
							<>
								<Separator orientation="horizontal" />
								<div className="flex justify-center w-full">
									<Button
										className="gap-2 items-center"
										variant="link"
										asChild
									>
										<Link href="/signup">
											<LogIn /> Sign Up
										</Link>
									</Button>
								</div>
							</>
							: null
					}
				</CardFooter>
			</form>
		</Form>
	);
};

export default EmailSignInForm;