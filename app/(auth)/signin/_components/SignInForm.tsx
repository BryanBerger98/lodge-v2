/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { object, string, z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const SignInForm = () => {

	const signInFormSchema = object({
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		password: string().min(1, 'Required.'),
	});

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		mode: 'onTouched',
	});

	const handleSubmitSignInForm = (values: z.infer<typeof signInFormSchema>) => {
		console.log(values);
	};

	return (
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
						className="gap-2 items-center"
						type="submit"
					><LogIn /> Sign In
					</Button>
					<Separator orientation="horizontal" />
					<Button
						className="gap-2 items-center"
						variant="link"
						asChild
					>
						<Link href="/signup">
							<LogIn /> Sign Up
						</Link>
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
};

export default SignInForm;