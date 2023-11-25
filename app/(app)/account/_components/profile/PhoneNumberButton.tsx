'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { parsePhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

import InputPhone from '@/components/forms/Input/InputPhone';
import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { updateAccount } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';

const PhoneNumberFormSchema = z.object({ phone_number: z.coerce.string().optional() });

type PhoneNumberFormValues = z.infer<typeof PhoneNumberFormSchema>;

export const PhoneNumberButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<PhoneNumberFormValues>({
		resolver: zodResolver(PhoneNumberFormSchema),
		defaultValues: { phone_number: currentUser?.phone_number },
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('phone_number', currentUser.phone_number);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSubmit = async (values: PhoneNumberFormValues) => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedUser = await updateAccount(values, { csrfToken });
			await updateCurrentUser(updatedUser);
			form.reset({ phone_number: updatedUser.phone_number });
			setIsDialogOpen(false);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			triggerErrorToast(apiError, form);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDialogOpenChange = (open: boolean) => {
		if (!isLoading) {
			setIsDialogOpen(open);
		}
	};

	return (
		<>
			<Dialog
				open={ isDialogOpen }
				onOpenChange={ handleDialogOpenChange }
			>
				<DialogTrigger asChild>
					<ButtonItem
						value={ currentUser?.phone_number ? parsePhoneNumber(currentUser.phone_number)?.formatInternational() : '' }
						onClick={ handleOpenDialog }
					>
						Phone
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<Form { ...form }>
						<form onSubmit={ form.handleSubmit(handleSubmit) }>
							<DialogHeader>
								<DialogTitle>Phone number</DialogTitle>
							</DialogHeader>
							<div className="py-4">
								<FormField
									control={ form.control }
									name="phone_number"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>Phone number</FormLabel>
											<FormControl>
												<InputPhone
													defaultCountry="FR"
													name={ field.name }
													value={ field.value }
													onBlur={ field.onBlur }
													onChange={ field.onChange }
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
								/>
							</div>
							<DialogFooter>
								<Button
									className="gap-2"
									disabled={ isLoading }
									type="submit"
								>
									{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size="16" /> }
									Save
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default PhoneNumberButton;