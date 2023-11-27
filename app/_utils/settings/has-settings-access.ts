import { findSettingByName } from '@/database/setting/setting.repository';
import { findUsers } from '@/database/user/user.repository';
import { Role } from '@/schemas/role.schema';
import { SettingName, UnregisteredSettingStringPopulatedSchema } from '@/schemas/setting';
import { IUserPopulated } from '@/schemas/user/populated.schema';

export const hasSettingsAccess = async (currentUser: IUserPopulated) => {
	if (currentUser.role === Role.OWNER) return true;

	const shareWithAdminSettingData = await findSettingByName(SettingName.SHARE_WITH_ADMIN);
	const shareWithAdminSetting = UnregisteredSettingStringPopulatedSchema.parse(shareWithAdminSettingData);

	if (shareWithAdminSetting.value === 'share_all_admin' && currentUser.role === Role.ADMIN) return true;
	if (shareWithAdminSetting.value === 'share_admin_selection' && currentUser.role === Role.ADMIN) {
		const shareWithAdminUsersListSetting = shareWithAdminSetting && shareWithAdminSetting.value === 'share_admin_selection' ? await findSettingByName(SettingName.SHARE_WITH_ADMIN_USERS_LIST) : null;
		const adminUsers = shareWithAdminUsersListSetting ? await findUsers({
			role: Role.ADMIN,
			_id: { $in: shareWithAdminUsersListSetting.value }, 
		}) : [];

		if (adminUsers.some(adminUser => adminUser.id === currentUser.id)) return true;
	}

	return false;
};