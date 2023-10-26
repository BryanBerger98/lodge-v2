import { NextResponse } from 'next/server';

import { deleteFileById, findFileById } from '@/database/file/file.repository';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName } from '@/schemas/setting';
import { setServerAuthGuard } from '@/utils/auth';
import { sendBuiltErrorWithSchemaValidation } from '@/utils/error';

import { DeleteImageSettingSchema } from './_schemas/delete-image-setting.schema';

export const DELETE = async (_: any, { params }: { params: { setting_name: string } }) => {
	try {
		
		const { name } = DeleteImageSettingSchema.parse({ name: params.setting_name });

		await connectToDatabase();

		const shareWithAdminSetting = await findSettingByName(SettingName.SHARE_WITH_ADMIN);

		const rolesWhiteList: Role[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ Role.OWNER, Role.ADMIN ] : [ Role.OWNER ];

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList });

		const settingData = await findSettingByName(name);

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
			data_type: 'image',
			value: null,
			updated_by: currentUser.id,
		}, { upsert: true });
		
		return NextResponse.json(updatedSetting);
	} catch (error) {
		console.error(error);
		sendBuiltErrorWithSchemaValidation(error);
	}
};