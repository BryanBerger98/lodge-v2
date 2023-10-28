'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { updateAccount } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';


const NameFormSchema = z.object({
	first_name: z.string().min(1, 'Required.'),
	last_name: z.string().min(1, 'Required.'),
});

type NameFormValues = z.infer<typeof NameFormSchema>;

export const NameButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<NameFormValues>({
		resolver: zodResolver(NameFormSchema),
		defaultValues: {
			first_name: currentUser?.first_name || '',
			last_name: currentUser?.last_name || '',
		},
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('first_name', currentUser.first_name || '');
			form.setValue('last_name', currentUser.last_name || '');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSubmit = async (values: NameFormValues) => {
		const { first_name, last_name } = values;
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedUser = await updateAccount({
				first_name,
				last_name, 
			}, { csrfToken });
			await updateCurrentUser(updatedUser);
			form.reset({
				first_name: updatedUser.first_name || '',
				last_name: updatedUser.last_name || '', 
			});
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
						value={ currentUser?.first_name && currentUser?.last_name ? `${ currentUser.first_name } ${ currentUser.last_name }` : '' }
						onClick={ handleOpenDialog }
					>
						Name
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<Form { ...form }>
						<form onSubmit={ form.handleSubmit(handleSubmit) }>
							<DialogHeader>
								<DialogTitle>Name</DialogTitle>
							</DialogHeader>
							<div className="py-4 space-y-4">
								<FormField
									control={ form.control }
									name="first_name"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
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
								<FormField
									control={ form.control }
									name="last_name"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>Last name</FormLabel>
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

export default NameButton;