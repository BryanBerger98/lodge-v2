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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Gender } from '@/schemas/user/gender.schema';
import { updateAccount } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';

const GenderFormSchema = z.object({ gender: z.nativeEnum(Gender) });

type GenderFormValues = z.infer<typeof GenderFormSchema>;

export const GenderButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<GenderFormValues>({
		resolver: zodResolver(GenderFormSchema),
		defaultValues: { gender: currentUser?.gender || Gender.UNSPECIFIED },
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('gender', currentUser?.gender || Gender.UNSPECIFIED);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSubmit = async ({ gender }: GenderFormValues) => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedUser = await updateAccount({ gender }, { csrfToken });
			await updateCurrentUser(updatedUser);
			form.reset({ gender: updatedUser.gender || Gender.UNSPECIFIED });
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
						className="capitalize"
						value={ currentUser?.gender }
						onClick={ handleOpenDialog }
					>
						Gender
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<Form { ...form }>
						<form onSubmit={ form.handleSubmit(handleSubmit) }>
							<DialogHeader>
								<DialogTitle>Gender</DialogTitle>
							</DialogHeader>
							<div className="py-4">
								<FormField
									control={ form.control }
									name="gender"
									render={ ({ field }) => (
										<FormItem className="space-y-3">
											<FormControl>
												<RadioGroup
													className="flex flex-col space-y-1"
													defaultValue={ field.value }
													onValueChange={ field.onChange }
												>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value={ Gender.MALE } />
														</FormControl>
														<FormLabel className="font-normal">
															Male
														</FormLabel>
													</FormItem>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value={ Gender.FEMALE } />
														</FormControl>
														<FormLabel className="font-normal">
															Female
														</FormLabel>
													</FormItem>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value={ Gender.UNSPECIFIED } />
														</FormControl>
														<FormLabel className="font-normal">
															Unspecified
														</FormLabel>
													</FormItem>
												</RadioGroup>
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

export default GenderButton;