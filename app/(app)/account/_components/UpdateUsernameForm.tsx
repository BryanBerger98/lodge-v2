/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, object, string, z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import { updateAccount } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type UpdateUsernameFormProps = {
	csrfToken: string;
};

const UpdateUsernameForm = ({ csrfToken }: UpdateUsernameFormProps) => {

	const { toast } = useToast();
	const { currentUser, updateCurrentUser } = useAuth();

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const usernameFormSchema = object({ username: string().min(1, 'Required.') });

	const form = useForm<z.infer<typeof usernameFormSchema>>({
		resolver: zodResolver(usernameFormSchema),
		defaultValues: { username: currentUser?.username || '' },
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('username', currentUser.username || '');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleSubmitEmailForm = async (values: z.infer<typeof usernameFormSchema>) => {
		const { username } = values;
		
		try {
			setIsLoading(true);
			const updatedUser = await updateAccount({ username }, csrfToken);
			await updateCurrentUser(updatedUser);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof z.infer<typeof usernameFormSchema>;
						const [ inputName ] = issue.path;
						if (inputName) {
							form.setError(inputName.toString() as IssueName, { message: issue.message });
						}
					});
				}
			}
			toast({
				title: 'Error',
				description: getErrorMessage(apiError),
				variant: 'destructive',
				
			  });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full">
			<Form { ...form }>
				<form
					className="lg:flex"
					onSubmit={ form.handleSubmit(handleSubmitEmailForm) }
				>
					<CardHeader className="lg:w-1/3">
						<CardTitle>Username</CardTitle>
						<CardDescription>
							Update your username.
						</CardDescription>
					</CardHeader>
					<div className="lg:w-2/3">
						<CardContent className="lg:pt-6">
							<FormField
								control={ form.control }
								name="username"
								render={ ({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												type="text"
												{ ...field }
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								) }
							/>
						</CardContent>
						<CardFooter className="flex-col gap-4 items-end">
							<Button
								className="gap-2"
								disabled={ isLoading }
								type="submit"
							>
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
								Save
							</Button>
						</CardFooter>
					</div>
				</form>
			</Form>
		</Card>
	);
};

export default UpdateUsernameForm;