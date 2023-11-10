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
import { UnregisteredSettingBooleanPopulated } from '@/schemas/setting';

import AppleAuthButton from '../../_components/ProvidersButtons/AppleAuthButton';
import GoogleAuthButton from '../../_components/ProvidersButtons/GoogleAuthButton';
import { SignUpStep } from '../_context';
import { useSignUp } from '../_context/useSignUp';

const SignUpFormSchema = z.object({ email: z.string().email('Please, provide a valid email address.').min(1, 'Required.') });
type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

type SignUpFormFormProps = {
	googleAuthSetting: UnregisteredSettingBooleanPopulated | null;
	appleAuthSetting: UnregisteredSettingBooleanPopulated | null;
};

const SignUpForm = ({ googleAuthSetting, appleAuthSetting } :SignUpFormFormProps) => {
	
	const { isLoading, step, setStep, setEmail, email } = useSignUp();

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { email },
		mode: 'onTouched',
	});

	const handleSubmitEmailSignInForm = (values: SignUpFormValues) => {
		setEmail(values.email);
		setStep(SignUpStep.PASSWORD);
	};

	if (step !== SignUpStep.EMAIL) {
		return null;
	}

	const areProvidersEnabled =
		(googleAuthSetting && googleAuthSetting.data_type === 'boolean' && googleAuthSetting.value)
		|| (appleAuthSetting && appleAuthSetting.data_type === 'boolean' && appleAuthSetting.value);

	return (
		<Form { ...form }>
			<form onSubmit={ form.handleSubmit(handleSubmitEmailSignInForm) }>
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>
						Create an account to sign into the app.
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
					<Separator orientation="horizontal" />
					<div className="flex justify-center w-full">
						<Button
							className="gap-2 items-center"
							variant="link"
							asChild
						>
							<Link href="/signin">
								<LogIn /> Sign In
							</Link>
						</Button>
					</div>
				</CardFooter>
			</form>
		</Form>
	);
};

export default SignUpForm;