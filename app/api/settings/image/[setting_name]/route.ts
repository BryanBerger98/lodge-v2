import { NextResponse } from 'next/server';

import { hasSettingsAccess } from '@/app/_utils/settings/has-settings-access';
import { deleteFileById, findFileById } from '@/database/file/file.repository';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { Role } from '@/schemas/role.schema';
import { SettingDataType } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';

import { DeleteImageSettingSchema } from './_schemas/delete-image-setting.schema';

export const DELETE = routeHandler(async (_, { params, currentUser }) => {

	const { name } = DeleteImageSettingSchema.parse({ name: params.setting_name });

	const hasUserSettingsAccess = hasSettingsAccess(currentUser);

	if (!hasUserSettingsAccess) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const settingData = await findSettingByName(name);

	if (!settingData) {
		throw buildApiError({
			code: ApiErrorCode.SETTING_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (settingData && settingData.data_type === SettingDataType.IMAGE && settingData.value && 'id' in settingData.value && settingData.value.id) {
		const oldFile = await findFileById(settingData.value.id);
		if (oldFile) {
			await deleteFileFromKey(oldFile.key);
			await deleteFileById(oldFile.id);
		}
	}

	const updatedSetting = await updateSetting({
		...settingData,
		name,
		data_type: SettingDataType.IMAGE,
		value: null,
		updated_by: currentUser.id,
	}, { upsert: true });

	return NextResponse.json(updatedSetting);
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});