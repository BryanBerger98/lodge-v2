/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, LogIn, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SettingPopulatedBoolean, UnregisteredSettingBooleanPopulated } from '@/schemas/setting';

import { useSignInContext } from './SignInCard';


type PasswordSignInFormProps = {
	userVerifyEmailSetting: SettingPopulatedBoolean | UnregisteredSettingBooleanPopulated | null;
	magicLinkSignInSetting: SettingPopulatedBoolean | UnregisteredSettingBooleanPopulated | null;
};

const PasswordSignInForm = ({ userVerifyEmailSetting, magicLinkSignInSetting }: PasswordSignInFormProps) => {

	const { isLoading, step, setStep, email, setIsLoading, setError } = useSignInContext();

	const router = useRouter();
	const searchParams = useSearchParams();
	const verificationToken = searchParams.get('verification_token');

	const passwordSignInFormSchema = z.object({ password: z.string().min(1, 'Required.') });

	const form = useForm<z.infer<typeof passwordSignInFormSchema>>({
		resolver: zodResolver(passwordSignInFormSchema),
		defaultValues: { password: '' },
		mode: 'onTouched',
	});

	const handleGoBack = () => setStep('email');

	const handleSubmitEmailSignInForm = () => {
		setIsLoading(true);
		setError(null);
		signIn('credentials', {
			redirect: false,
			email,
			password: form.getValues('password'),
		})
			.then((data) => {
				if (data?.error) {
					setError('Incorrect credentials.');
				} else {
					if (!userVerifyEmailSetting || (userVerifyEmailSetting && userVerifyEmailSetting.value)) {
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

	const handleSendSignInMagicLink = () => {
		if (!magicLinkSignInSetting || !magicLinkSignInSetting.value) {
			return;
		}
		setIsLoading(true);
		setError(null);
		signIn('email', {
			callbackUrl: '/',
			redirect: false,
			email,
		})
			.then((data) => {
				if (data?.error) {
					console.error(data.error);
					setError('Incorrect credentials.');
				} else {
					setStep('magic-email-sent');
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

	if (step !== 'password') {
		return null;
	}	

	return (
		<Form { ...form }>
			<form onSubmit={ form.handleSubmit(handleSubmitEmailSignInForm) }>
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>
						Sign in with <span className="font-bold">{ email }</span>.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{
						magicLinkSignInSetting && magicLinkSignInSetting.value ?
							<div className="flex flex-col gap-4">
								<Button
									className="gap-2 w-full"
									disabled={ isLoading }
									type="button"
									onClick={ handleSendSignInMagicLink }
								>
									{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 size="16" /> }
									Sign in with magic link
								</Button>
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
							</div>
							: null
					}
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
						{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn size="16" /> }
						Sign in
					</Button>
					<Separator orientation="horizontal" />
					<div className="flex w-full justify-between">
						<Button
							className="gap-2 items-center"
							variant="link"
							onClick={ handleGoBack }
						>
							<ChevronLeft /> Back
						</Button>
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
	);
};

export default PasswordSignInForm;