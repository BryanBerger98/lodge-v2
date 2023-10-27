import { NextResponse } from 'next/server';

import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { setServerAuthGuard } from '@/utils/auth';

import { UpdateImageSettingSchema } from '../_schemas/update-image.setting.schema';
import { uploadPhotoFile } from '../_utils/upload-photo-file';

export const PUT = routeHandler(async (request) => {
	await connectToDatabase();

	const shareWithAdminSetting = await findSettingByName(SettingName.SHARE_WITH_ADMIN);

	const rolesWhiteList: Role[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ Role.OWNER, Role.ADMIN ] : [ Role.OWNER ];

	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList });

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
});