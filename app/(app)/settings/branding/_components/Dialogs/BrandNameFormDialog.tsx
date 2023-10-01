'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import { updateSettings } from '@/services/settings.service';
import { ApiError, getErrorMessage } from '@/utils/error';
import { BRAND_NAME_SETTING } from '@/utils/settings';

type BrandNameFormDialogProps = {
	isOpen: boolean;
};

const brandNameFormSchema = z.object({ brand_name: z.string().nonempty('Required.') });

const BrandNameFormDialog = ({ isOpen }: BrandNameFormDialogProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { csrfToken } = useCsrf();
	const { getSetting, loading, refetchSettings } = useSettings();

	const brandNameSetting = getSetting(BRAND_NAME_SETTING);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof brandNameFormSchema>>({
		resolver: zodResolver(brandNameFormSchema),
		defaultValues: { brand_name: '' },
		mode: 'onSubmit',
	});

	const handleSetDefaultValues = () => {
		form.setValue('brand_name', brandNameSetting?.data_type === 'string' && brandNameSetting?.value !== undefined ? brandNameSetting.value : '');
	};

	useEffect(() => {
		handleSetDefaultValues();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		brandNameSetting?.value,
	]);

	const handleClose = () => {
		const params = new URLSearchParams(searchParams);
		params.delete('edit_setting');
		router.push(`${ pathname }?${ params.toString() }`);
	};

	const handleSubmit = async ({ brand_name }: z.infer<typeof brandNameFormSchema>) => {
		try {
			if (!csrfToken) return;
			setIsLoading(true);
			await updateSettings([
				{
					name: BRAND_NAME_SETTING,
					value: brand_name,
					data_type: 'string',
				},
			], csrfToken);
			refetchSettings();
		} catch (error) {
			const apiError = error as ApiError<unknown>;
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
		<Dialog
			open={ isOpen }
			onOpenChange={ handleClose }
		>
			<DialogContent className="sm:max-w-[425px]">
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmit) }>
						<DialogHeader>
							<DialogTitle>Brand name</DialogTitle>
							<DialogDescription>Set up a name for your app.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<FormField
								control={ form.control }
								name="brand_name"
								render={ ({ field }) => (
									<FormItem className="mb-4">
										<FormLabel>Brand name</FormLabel>
										<FormControl>
											<Input
												disabled={ loading === 'pending' }
												placeholder="Lodge"
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
								{ 
									isLoading ?
										<Loader2
											className="animate-spin"
											size="16"
										/>
										: <Save size="16"/>
								}
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default BrandNameFormDialog;