/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown, Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import SearchSelect, { SelectOption } from '@/components/ui/Select/SearchSelect';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { getShareSettings, updateSettings } from '@/services/settings.service';
import { fetchUsers } from '@/services/users.service';
import { ISetting } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import { ApiError, getErrorMessage } from '@/utils/error';
import { OWNER_SETTING, SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

const shareSettingsFormSchema = z.object({
	share_with_admin: z.boolean().default(false).optional(),
	owner: z.string().optional(),
});

type ShareSettingsProps = {
	csrfToken: string;
};

const ShareSettings = ({ csrfToken }: ShareSettingsProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isSearchLoading, setIsSearchLoading ] = useState<boolean>(false);
	const [ searchedOptions, setSearchedOptions ] = useState<SelectOption[]>([]);
	const [ ownerUser, setOwnerUser ] = useState<IUser | null>(null);
	const [ shareWithAdminSetting, setShareWithAdminSetting ] = useState<ISetting | null>(null);
	const [ ownerSetting, setOwnerSetting ] = useState<ISetting | null>(null);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof shareSettingsFormSchema>>({
		resolver: zodResolver(shareSettingsFormSchema),
		defaultValues: {
			share_with_admin: false,
			owner: '',
		},
		mode: 'onSubmit',
	});

	useEffect(() => {
		getShareSettings()
			.then(({ ownerUser: owner, settings }) => {
				form.setValue('owner', owner.id.toString());
				setOwnerUser(owner);
				setOwnerSetting(settings.owner);
				const { value } = settings.shareWithAdmin;
				if (typeof value === 'boolean') {
					form.setValue('share_with_admin', value);
				} else {
					form.setValue('share_with_admin', false);
				}
				setShareWithAdminSetting(settings.shareWithAdmin);
			})
			.catch(console.error);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = async (value: string) => {
		try {
			setIsSearchLoading(true);
			const data = await fetchUsers({
				search: value,
				roles: [ 'admin', 'user' ],
			});
			const options = value ? data.users.map(user => ({
				value: user.id.toString(),
				label: `${ user.username ? user.username + ' - ' : '' }${ user.email }`,
			})) : [];
			setSearchedOptions(options);
		} catch (error) {
			console.error(error);
		} finally {
			setIsSearchLoading(false);
		}
	};

	const handleCancel = () => {
		form.setValue('owner', ownerUser?.id.toString() || '');
		if (shareWithAdminSetting?.value && typeof shareWithAdminSetting.value === 'boolean') {
			form.setValue('share_with_admin', shareWithAdminSetting.value);
		} else {
			form.setValue('share_with_admin', false);
		}
	};

	const handleSubmitShareForm = async (values: z.infer<typeof shareSettingsFormSchema>) => {
		try {
			setIsLoading(true);
			await updateSettings(csrfToken,
				{
					id: ownerSetting?.id,
					name: ownerSetting?.name || OWNER_SETTING,
					value: values.owner,
					data_type: 'objectId',
				},
				{
					id: shareWithAdminSetting?.id,
					name: shareWithAdminSetting?.name || SHARE_WITH_ADMIN_SETTING,
					value: values.share_with_admin || false,
					data_type: 'boolean',
				}
			);
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
		<Card>
			<Form { ...form }>
				<form onSubmit={ form.handleSubmit(handleSubmitShareForm) }>
					<CardHeader>
						<CardTitle>Share settings</CardTitle>
						<CardDescription>Manage who has access to settings.</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={ form.control }
							name="share_with_admin"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Share settings with admin
										</FormLabel>
										<FormDescription>
											If this option is active, users with admin role could see and edit these settings.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={ field.value }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="owner"
							render={ ({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Owner</FormLabel>
									<SearchSelect
										isLoading={ isSearchLoading }
										options={ searchedOptions }
										value={ field.value }
										onSearch={ handleSearch }
										onSelect={ field.onChange }
									>
										<Button
											className="w-full justify-between"
											role="combobox"
											variant="outline"
										>
											{
												field.value === ownerUser?.id && ownerUser
													? `${ ownerUser.username ? ownerUser.username + ' - ' : '' }${ ownerUser.email }`
													: field.value
														? searchedOptions.find(
															(option) => option.value === field.value
														)?.label
														: 'Select a user as owner' 
											}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</SearchSelect>
									<FormDescription>
										Select user to tranfer ownership.
									</FormDescription>
								</FormItem>
							) }
						/>
					</CardContent>
					<CardFooter className="gap-4 justify-end">
						<Button
							className="gap-2"
							type="button"
							variant="outline"
							onClick={ handleCancel }
						>
							<X />
							Cancel
						</Button>
						<Button
							className="gap-2"
							disabled={ isLoading }
							type="submit"
						>
							{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
							Save
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};

export default ShareSettings;