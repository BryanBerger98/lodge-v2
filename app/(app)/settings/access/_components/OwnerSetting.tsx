'use client';

import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import PasswordModal from '@/app/_components/modals/auth/PasswordModal';
import SearchSelect, { SelectOption } from '@/components/forms/Select/SearchSelect';
import { Button } from '@/components/ui/button';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName, UnregisteredSetting } from '@/schemas/setting';
import { User } from '@/schemas/user';
import { updateShareSettings } from '@/services/settings.service';
import { fetchUsers } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

type OwnerSettingProps = {
	ownerUser: User | null;
};

const OwnerSetting = ({ ownerUser }: OwnerSettingProps) => {

	const [ isSearchLoading, setIsSearchLoading ] = useState<boolean>(false);
	const [ searchedOptions, setSearchedOptions ] = useState<SelectOption[]>([]);
	const [ ownerSelectValue, setOwnerSelectValue ] = useState<string>('');
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { csrfToken } = useCsrf();
	const { getSetting, loading, refetchSettings } = useSettings();
	const { currentUser, fetchCurrentUser } = useAuth();
	const { triggerErrorToast } = useErrorToast();

	const ownerSetting = getSetting(SettingName.OWNER);

	useEffect(() => {
		setOwnerSelectValue(ownerSetting?.value || ownerUser?.id || '');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ownerSetting?.value ]);

	const handleSearch = async (value: string) => {
		try {
			setIsSearchLoading(true);
			const data = await fetchUsers({
				search: value,
				roles: [ Role.ADMIN, Role.USER ],
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

	const handleSelectOwner = (value: string) => {
		setOwnerSelectValue(value);
		setIsPasswordModalOpen(true);
	};

	const handlePasswordModalOpenChange = async ({ openState, password }: { openState: boolean, password: string }) => {

		if (!password) {
			setOwnerSelectValue(ownerSetting?.value || ownerUser?.id || '');
			setIsPasswordModalOpen(false);
			return;
		}

		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				description: 'Invalid CSRF token.',
			});
			return;
		}
		
		try {
			setIsLoading(true);
			const settingsToUpdate: UnregisteredSetting[] = [];
			if ((ownerSelectValue && ownerSelectValue !== ownerUser?.id) || (ownerSelectValue && ownerSelectValue !== ownerSetting?.value)) {
				settingsToUpdate.push({
					id: ownerSetting?.id,
					name: ownerSetting?.name || SettingName.OWNER,
					value: ownerSelectValue,
					data_type: SettingDataType.OBJECT_ID,
				});
			}
			if (settingsToUpdate.length === 0) {
				return;
			}
			await updateShareSettings({
				settings: settingsToUpdate,
				password, 
			}, { csrfToken });
			await refetchSettings();
			if (settingsToUpdate.find(({ name }) => name === SettingName.OWNER)) {
				await fetchCurrentUser();
			}
			setIsPasswordModalOpen(openState);
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="space-y-2">
				<SearchSelect
					isLoading={ isSearchLoading }
					options={ searchedOptions }
					value={ ownerSelectValue }
					onSearch={ handleSearch }
					onSelect={ handleSelectOwner }
				>
					<Button
						className="w-full justify-between"
						disabled={ currentUser?.role !== 'owner' || loading === 'pending' }
						role="combobox"
						variant="outline"
					>
						{
							ownerSelectValue === ownerUser?.id && ownerUser
								? `${ ownerUser.username ? ownerUser.username + ' - ' : '' }${ ownerUser.email }`
								: ownerSelectValue
									? searchedOptions.find(
										(option) => option.value === ownerSelectValue
									)?.label
									: 'Select a user as owner' 
						}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</SearchSelect>
			</div>
			<PasswordModal
				isLoading={ isLoading }
				isOpen={ isPasswordModalOpen }
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default OwnerSetting;