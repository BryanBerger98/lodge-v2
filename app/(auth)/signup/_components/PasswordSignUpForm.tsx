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
import { UnregisteredSettingBooleanPopulated } from '@/schemas/setting';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules } from '@/utils/password.util';

import { SignUpStep } from '../_context';
import { useSignUp } from '../_context/useSignUp';

type PasswordSignUpFormProps = {
	userVerifyEmailSetting: UnregisteredSettingBooleanPopulated | null;
	magicLinkSignUpSetting: UnregisteredSettingBooleanPopulated | null;
	passwordRules: {
		uppercase_min: number;
		lowercase_min: number;
		numbers_min: number;
		symbols_min: number;
		min_length: number;
		should_contain_unique_chars: boolean;
	};
};

const PasswordSignUpForm = ({ userVerifyEmailSetting, magicLinkSignUpSetting, passwordRules }: PasswordSignUpFormProps) => {

	const { isLoading, step, setStep, email, setIsLoading, setError } = useSignUp();

	const PasswordSignUpFormSchema = z.object({
		password: z.string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }),
		passwordConfirm: z.string().min(1, 'Required'),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: [ 'passwordConfirm' ],
		message: 'Must be the same as password.',
	});

	const router = useRouter();
	const searchParams = useSearchParams();
	const verificationToken = searchParams.get('verification_token');

	const form = useForm<z.infer<typeof PasswordSignUpFormSchema>>({
		resolver: zodResolver(PasswordSignUpFormSchema),
		defaultValues: {
			password: '',
			passwordConfirm: '', 
		},
		mode: 'onTouched',
	});

	const handleGoBack = () => setStep(SignUpStep.EMAIL);

	const handleSubmit = () => {
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

	const handleSendSignUpMagicLink = () => {
		if (!magicLinkSignUpSetting || !magicLinkSignUpSetting.value) {
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
					setStep(SignUpStep.MAGIC_EMAIL_SENT);
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

	if (step !== SignUpStep.PASSWORD) {
		return null;
	}

	return (
		<Form { ...form }>
			<form onSubmit={ form.handleSubmit(handleSubmit) }>
				<CardHeader>
					<CardTitle>Sign up</CardTitle>
					<CardDescription>
						Sign up with <span className="font-bold">{ email }</span>.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{
						magicLinkSignUpSetting && magicLinkSignUpSetting.data_type === 'boolean' && magicLinkSignUpSetting.value ?
							<div className="flex flex-col gap-4">
								<Button
									className="gap-2 w-full"
									disabled={ isLoading }
									type="button"
									onClick={ handleSendSignUpMagicLink }
								>
									{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 size="16" /> }
									Sign up with magic link
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
							<FormItem>
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
				</CardContent>
				<CardFooter className="flex-col gap-4">
					<Button
						className="gap-2"
						disabled={ isLoading }
						type="submit"
					>
						{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn size="16" /> }
						Sign up
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
							<Link href="/signin">
								Sign in
							</Link>
						</Button>
					</div>
				</CardFooter>
			</form>
		</Form>
	);
};

export default PasswordSignUpForm;