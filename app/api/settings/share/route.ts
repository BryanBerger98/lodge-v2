import { NextResponse } from 'next/server';

import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { findOwnerUser, findUserById, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { authenticateUserWithPassword, setServerAuthGuard } from '@/utils/auth';

import { UpdateShareSettingsSchema } from './_schemas/update-share-settings.schema';

export const GET = routeHandler(async () => {
	await connectToDatabase();

	await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER ] });

	const shareWithAdminSetting = await findSettingByName(SettingName.SHARE_WITH_ADMIN);
	const ownerSetting = await findSettingByName(SettingName.OWNER);

	const ownerUser = await findOwnerUser();

	if (!ownerUser) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	return NextResponse.json({
		settings: {
			shareWithAdmin: shareWithAdminSetting ?? {
				name: SettingName.SHARE_WITH_ADMIN,
				value: false,
				data_type: SettingDataType.BOOLEAN,
			},
			owner: ownerSetting ?? {
				name: SettingName.OWNER,
				value: ownerUser.id,
				data_type: SettingDataType.OBJECT_ID,
			},
		},
		ownerUser,
	});
});

export const PUT = routeHandler(async (request) => {

	await connectToDatabase();

	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER ] });

	const body = await request.json();

	const { settings: settingsToUpdate, password } = UpdateShareSettingsSchema.parse(body);

	if (settingsToUpdate.length === 0) {
		return NextResponse.json({ message: 'Nothing to update.' });
	}

	await authenticateUserWithPassword(currentUser, password);

	const ownerSetting = settingsToUpdate.find(setting => setting.name === SettingName.OWNER);

	if (ownerSetting?.value) {
		const prevOwnerUser = await findOwnerUser();
		const newOwnerUser = await findUserById(ownerSetting.value);
		if (!prevOwnerUser || !newOwnerUser) {
			throw buildApiError({
				code: ApiErrorCode.USER_NOT_FOUND,
				status: StatusCode.NOT_FOUND,
			});
		}
		await updateUser({
			id: prevOwnerUser?.id,
			updated_by: currentUser.id,
			role: Role.ADMIN,
		});
		await updateUser({
			id: newOwnerUser.id,
			updated_by: currentUser.id,
			role: Role.OWNER,
		});
	}

	console.log('SETTINGS TO UPDATE >>> ', settingsToUpdate);
	for (const setting of settingsToUpdate) {
		await updateSetting({
			...setting,
			updated_by: currentUser.id,
		}, {
			upsert: true,
			newDocument: true, 
		});
	}

	return NextResponse.json({ message: 'Updated.' });

});