/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown, Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import PasswordModal, { PasswordModalOpenChangeEvent } from '@/components/features/auth/PasswordModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import SearchSelect, { SelectOption } from '@/components/ui/Select/SearchSelect';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import useSettings from '@/context/settings/useSettings';
import { updateShareSettings } from '@/services/settings.service';
import { fetchUsers } from '@/services/users.service';
import { UnregisteredSetting } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import { ApiError, getErrorMessage } from '@/utils/error';
import { OWNER_SETTING, SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

const shareSettingsFormSchema = z.object({
	share_with_admin: z.boolean().default(false).optional(),
	owner: z.string().optional(),
});

type ShareSettingsProps = {
	csrfToken: string;
	ownerUser: IUser | null;
};

const ShareSettings = ({ csrfToken, ownerUser }: ShareSettingsProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isSearchLoading, setIsSearchLoading ] = useState<boolean>(false);
	const [ searchedOptions, setSearchedOptions ] = useState<SelectOption[]>([]);
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);
	
	const { getSetting, loading, refetchSettings } = useSettings();
	const { currentUser, fetchCurrentUser } = useAuth();

	const shareWithAdminSetting = getSetting(SHARE_WITH_ADMIN_SETTING);
	const ownerSetting = getSetting(OWNER_SETTING);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof shareSettingsFormSchema>>({
		resolver: zodResolver(shareSettingsFormSchema),
		defaultValues: {
			share_with_admin: false,
			owner: '',
		},
		mode: 'onTouched',
	});

	useEffect(() => {
		form.setValue('share_with_admin', shareWithAdminSetting?.value || false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ shareWithAdminSetting?.value ]);

	useEffect(() => {
		form.setValue('owner', ownerSetting?.value || ownerUser?.id || '');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ownerSetting?.value ]);

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

	const handleSubmitShareForm = ({ owner, share_with_admin }: z.infer<typeof shareSettingsFormSchema>) => {
		if (
			((owner && owner !== ownerUser?.id.toString()) || (owner && owner !== ownerSetting?.value))
			|| (share_with_admin !== undefined && share_with_admin !== shareWithAdminSetting?.value)
		) {
			setIsPasswordModalOpen(true);
		}
	};

	const handlePasswordModalOpenChange: PasswordModalOpenChangeEvent = async ({ openState, password }) => {

		if (!password) {
			setIsPasswordModalOpen(false);
			return;
		}

		const { share_with_admin, owner } = form.getValues();
		
		try {
			setIsPasswordModalOpen(openState);
			setIsLoading(true);
			const settingsToUpdate: UnregisteredSetting[] = [];
			if ((owner && owner !== ownerUser?.id.toString()) || (owner && owner !== ownerSetting?.value)) {
				settingsToUpdate.push({
					id: ownerSetting?.id,
					name: ownerSetting?.name || OWNER_SETTING,
					value: owner,
					data_type: 'objectId',
				});
			}
			if (share_with_admin !== undefined && share_with_admin !== shareWithAdminSetting?.value) {
				settingsToUpdate.push({
					id: shareWithAdminSetting?.id,
					name: shareWithAdminSetting?.name || SHARE_WITH_ADMIN_SETTING,
					value: share_with_admin || false,
					data_type: 'boolean',
				});
			}
			if (settingsToUpdate.length === 0) {
				return;
			}
			await updateShareSettings(settingsToUpdate, csrfToken, password);
			await refetchSettings();
			if (settingsToUpdate.find(({ name }) => name === OWNER_SETTING)) {
				await fetchCurrentUser();
			}
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
		<>
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
												disabled={ currentUser?.role !== 'owner' || loading === 'pending' }
												onBlur={ field.onBlur }
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
											onBlur={ field.onBlur }
											onSearch={ handleSearch }
											onSelect={ field.onChange }
										>
											<Button
												className="w-full justify-between"
												disabled={ currentUser?.role !== 'owner' || loading === 'pending' }
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
						{
							currentUser?.role === 'owner' ?
								<CardFooter className="gap-4 justify-end">
									<Button
										className="gap-2"
										disabled={ loading === 'pending' }
										type="button"
										variant="outline"
										onClick={ handleCancel }
									>
										<X />
										Cancel
									</Button>
									<Button
										className="gap-2"
										disabled={ isLoading || loading === 'pending' }
										type="submit"
									>
										{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
										Save
									</Button>
								</CardFooter>
								: null
						}
					</form>
				</Form>
			</Card>
			<PasswordModal
				isOpen={ isPasswordModalOpen }
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default ShareSettings;