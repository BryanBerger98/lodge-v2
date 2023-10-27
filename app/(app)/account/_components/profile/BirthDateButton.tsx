'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import DatePickerInput from '@/components/ui/DatePicker/DatePickerInput';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { updateAccount } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';

const BirthDateFormSchema = z.object({ birth_date: z.coerce.date().optional() });

type BirthDateFormValues = z.infer<typeof BirthDateFormSchema>;

export const BirthDateButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<BirthDateFormValues>({
		resolver: zodResolver(BirthDateFormSchema),
		defaultValues: { birth_date: currentUser?.birth_date || undefined },
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('birth_date', currentUser?.birth_date || undefined);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSubmit = async ({ birth_date }: BirthDateFormValues) => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedUser = await updateAccount({ birth_date }, { csrfToken });
			await updateCurrentUser(updatedUser);
			form.reset({ birth_date: updatedUser.birth_date || undefined });
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
						value={ currentUser?.birth_date ? format(currentUser.birth_date, 'dd/MM/yyyy') : null }
						onClick={ handleOpenDialog }
					>
						Birth date
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<Form { ...form }>
						<form onSubmit={ form.handleSubmit(handleSubmit) }>
							<DialogHeader>
								<DialogTitle>Birth date</DialogTitle>
							</DialogHeader>
							<div className="py-4 space-y-4">
								<FormField
									control={ form.control }
									name="birth_date"
									render={ ({ field: { onChange: handleChange, value } }) => (
										<FormItem>
											<FormLabel>Date de naissance</FormLabel>
											<DatePickerInput
												selected={ value }
												initialFocus
												onSelect={ handleChange }
											/>
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

export default BirthDateButton;