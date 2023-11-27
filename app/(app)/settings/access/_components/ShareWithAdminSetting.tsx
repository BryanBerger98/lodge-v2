'use client';

import { Loader2, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import PasswordModal from '@/app/_components/modals/auth/PasswordModal';
import SearchSelectUsersModal from '@/app/_components/modals/users/SearchSelectUsersModal';
import ButtonList from '@/components/ui/Button/ButtonList';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName, UnregisteredSetting } from '@/schemas/setting';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { updateShareSettings } from '@/services/settings.service';
import { ApiError } from '@/utils/api/error';

const SELECT_OPTIONS = [
	{
		value: 'dont_share',
		label: 'Don\'t share settings',
	},
	{
		value: 'share_all_admin',
		label: 'Share with all admin users',
	},
	{
		value: 'share_admin_selection',
		label: 'Share with a section of admin users',
	},
];

type ShareWithAdminSettingProps = {
	selectedAdminUsers: IUserPopulated[];
};

const ShareWithAdminSetting = ({ selectedAdminUsers: initialSelectedAdminUsers }: ShareWithAdminSettingProps) => {

	const [ shareSettingSelection, setShareSettingSelection ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isSearchAdminUsersModalOpen, setIsSearchAdminUsersModalOpen ] = useState(false);
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);

	const { getSetting, loading, refetchSettings } = useSettings();
	const { currentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const shareWithAdminSetting = getSetting(SettingName.SHARE_WITH_ADMIN);
	const shareWithAdminUsersList = getSetting(SettingName.SHARE_WITH_ADMIN_USERS_LIST);

	const [ alreadySelectedAdminUsers, setAlreadySelectedAdminUsers ] = useState<IUserPopulated[]>(initialSelectedAdminUsers);
	const [ selectedAdminUsers, setSelectedAdminUsers ] = useState<IUserPopulated[]>([]);
	const [ userToRevoke, setUserToRevoke ] = useState<IUserPopulated | null>(null);

	useEffect(() => {
		setShareSettingSelection(shareWithAdminSetting?.value || 'dont_share');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ shareWithAdminSetting?.value ]);

	const handleOpenSearchAdminUsersModal = () => setIsSearchAdminUsersModalOpen(true);

	const handleChangeShareSettingSelection = (value: string) => {
		setShareSettingSelection(value);
		if (value !== 'shade_admin_selection') {
			setIsPasswordModalOpen(true);
		}
	};

	const handleSearchAdminUsersModalOpenChange = ({ openState, selected }: { openState: boolean, selected: IUserPopulated[] }) => {
		setIsSearchAdminUsersModalOpen(openState);
		setSelectedAdminUsers(selected);
		if (selected.length > 0) {
			setIsPasswordModalOpen(true);
		}
	};

	const handlePasswordModalOpenChange = async ({ openState, password }: { openState: boolean, password: string }) => {

		if (!password) {
			setIsPasswordModalOpen(false);
			setShareSettingSelection(shareWithAdminSetting?.value || 'dont_share');
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
			if (shareSettingSelection !== undefined && shareSettingSelection !== shareWithAdminSetting?.value) {
				settingsToUpdate.push({
					id: shareWithAdminSetting?.id,
					name: shareWithAdminSetting?.name || SettingName.SHARE_WITH_ADMIN,
					value: shareSettingSelection || 'dont_share',
					data_type: SettingDataType.STRING,
				});
			}
			if (selectedAdminUsers.length > 0 || userToRevoke) {
				settingsToUpdate.push({
					id: shareWithAdminUsersList?.id,
					name: shareWithAdminUsersList?.name || SettingName.SHARE_WITH_ADMIN_USERS_LIST,
					value: alreadySelectedAdminUsers.concat(selectedAdminUsers).filter(user => userToRevoke && user.id !== userToRevoke.id ? true : !userToRevoke).map(user => user.id),
					data_type: SettingDataType.ARRAY_OF_OBJECT_IDS,
				});
			}
			if (settingsToUpdate.length === 0) {
				return;
			}
			await updateShareSettings({
				settings: settingsToUpdate,
				password, 
			}, { csrfToken });
			setAlreadySelectedAdminUsers(alreadySelectedAdminUsers.concat(selectedAdminUsers).filter(user => userToRevoke && user.id !== userToRevoke.id ? true : !userToRevoke));
			setUserToRevoke(null);
			setSelectedAdminUsers([]);
			await refetchSettings();
			setIsPasswordModalOpen(openState);
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRevokeAccess = (user: IUserPopulated) => () => {
		setUserToRevoke(user);
		setIsPasswordModalOpen(true);
	};

	if (loading === 'pending') return <Loader2 className="w-4 h-4 animate-spin" />;

	return (
		<>
			<Select
				disabled={ currentUser?.role !== Role.OWNER }
				value={ shareSettingSelection }
				onValueChange={ handleChangeShareSettingSelection }
			>
				<SelectTrigger>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					{
						SELECT_OPTIONS.map(option => (
							<SelectItem
								key={ option.value }
								value={ option.value }
							>{ option.label }
							</SelectItem>
						))
					}
				</SelectContent>
			</Select>
			{
				shareSettingSelection === 'share_admin_selection' ? (
					<>
						{
							shareWithAdminUsersList?.value.length ? (
								<ButtonList>
									{
										alreadySelectedAdminUsers.map(user => (
											<ButtonItem
												key={ user.id }
												disabled={ currentUser?.role !== Role.OWNER }
												rightIcon={
													currentUser?.role === Role.OWNER ? ( 
														<TooltipProvider delayDuration={ 100 }>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Trash className="w-4 h-4 group-hover:text-destructive" />
																</TooltipTrigger>
																<TooltipContent>
																	Revoke access
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													) : null
												}
												value={ (user.first_name && user.last_name) || user.username ? user.email : null }
												valueAsDescription
												onClick={ handleRevokeAccess(user) }
											>
												{ user.first_name && user.last_name ? user.first_name + ' ' + user.last_name : user.username ? user.username: user.email }
											</ButtonItem>
										))
									}
								</ButtonList>
							) : null
						}
						{
							currentUser?.role === Role.OWNER ? (
								<ButtonList>
									<ButtonItem
										rightIcon={ <Plus className="w-4 h-4" /> }
										onClick={ handleOpenSearchAdminUsersModal }
									>
										Add admin users
									</ButtonItem>
								</ButtonList>
							) : null
						}
					</>
				) : null
			}
			<SearchSelectUsersModal
				alreadySelected={ alreadySelectedAdminUsers }
				isOpen={ isSearchAdminUsersModalOpen }
				roles={ [ Role.ADMIN ] }
				onOpenChange={ handleSearchAdminUsersModalOpenChange }
			/>
			<PasswordModal
				isLoading={ isLoading }
				isOpen={ isPasswordModalOpen }
				title={ userToRevoke ? 'Revoke access' : 'Confirm password' }
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default ShareWithAdminSetting;