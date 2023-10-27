import { NextResponse } from 'next/server';

import { deleteFileById, findFileById } from '@/database/file/file.repository';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';

import { DeleteImageSettingSchema } from './_schemas/delete-image-setting.schema';

export const DELETE = routeHandler(async (_, { params }) => {

	const { name } = DeleteImageSettingSchema.parse({ name: params.setting_name });

	await connectToDatabase();

	const shareWithAdminSetting = await findSettingByName(SettingName.SHARE_WITH_ADMIN);

	const rolesWhiteList: Role[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ Role.OWNER, Role.ADMIN ] : [ Role.OWNER ];

	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList });

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
});