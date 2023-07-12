/* eslint-disable react/jsx-handler-names */
'use client';

import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { ZodError } from 'zod';

import InputPhone from '@/components/forms/inputs/InputPhone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import { updateAccount } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type UpdatePhoneNumberFormProps = {
	csrfToken: string;
};

const UpdatePhoneNumberForm = ({ csrfToken }: UpdatePhoneNumberFormProps) => {

	const { toast } = useToast();
	const { currentUser, updateCurrentUser } = useAuth();

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const form = useForm<{ phone_number: string }>({
		defaultValues: { phone_number: currentUser?.phone_number || '' },
		mode: 'onSubmit',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('phone_number', currentUser.phone_number || '');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleSubmitEmailForm = async (values: { phone_number: string }) => {
		const { phone_number } = values;
		
		try {
			setIsLoading(true);
			const updatedUser = await updateAccount({ phone_number }, csrfToken);
			await updateCurrentUser(updatedUser);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof { phone_number: string };
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
					className="flex"
					onSubmit={ form.handleSubmit(handleSubmitEmailForm) }
				>
					<CardHeader className="w-1/3">
						<CardTitle>Phone number</CardTitle>
						<CardDescription>
							Update your phone number.
						</CardDescription>
					</CardHeader>
					<div className="w-2/3">
						<CardContent className="pt-6">
							<FormField
								control={ form.control }
								name="phone_number"
								render={ ({ field }) => {

									return (
										<FormItem>
											<FormLabel>Phone number</FormLabel>
											<FormControl>
												<InputPhone
													defaultCountry="FR"
													{ ...field }
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								} }
								rules={ { validate: (value) => isValidPhoneNumber(value) || 'Invalid phone number.' } }
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

export default UpdatePhoneNumberForm;