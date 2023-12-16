import { NextResponse } from 'next/server';

import { hasSettingsAccess } from '@/app/_utils/settings/has-settings-access';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { Role } from '@/schemas/role.schema';
import { SettingDataType } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { StatusCode } from '@/utils/api/http-status';

import { UpdateImageSettingSchema } from '../_schemas/update-image.setting.schema';

import { uploadPhotoFile } from './_utils/upload-photo-file';

export const PUT = routeHandler(async (request, { currentUser }) => {

	const hasUserSettingsAccess = hasSettingsAccess(currentUser);

	if (!hasUserSettingsAccess) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const formData = await request.formData();

	const { name, value } = UpdateImageSettingSchema.parse(Object.fromEntries(formData.entries()));

	const settingData = await findSettingByName(name);

	const photoFileData = await uploadPhotoFile(currentUser, value, settingData);

	const updatedSetting = await updateSetting({
		...settingData,
		name,
		data_type: SettingDataType.IMAGE,
		value: photoFileData?.id || (settingData?.data_type === SettingDataType.IMAGE && settingData?.value && 'id' in settingData.value && settingData.value.id) || null,
		updated_by: currentUser.id,
	}, { upsert: true });
		
	return NextResponse.json(updatedSetting);
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});