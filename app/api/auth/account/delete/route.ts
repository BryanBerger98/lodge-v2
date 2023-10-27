import { NextResponse } from 'next/server';
import { object, string } from 'zod';

import { deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { findSettingByName } from '@/database/setting/setting.repository';
import { deleteUserById, findUserWithPasswordById } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';
import { verifyPassword } from '@/utils/password.util';

export const POST = routeHandler(async (request) => {
	await connectToDatabase();

	const userAccountDeletionSetting = await findSettingByName(SettingName.USER_ACCOUNT_DELETION);

	if (userAccountDeletionSetting && !userAccountDeletionSetting.value) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const deleteUserEmailSchema = object({ password: string().min(1, 'Required.') });

	const body = await request.json();
	const { password } = deleteUserEmailSchema.parse(body);

	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.ADMIN, Role.USER ] });

	const userData = await findUserWithPasswordById(currentUser.id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (!userData.password) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_AUTH_METHOD,
			status: StatusCode.CONFLICT,
		});
	}

	const isPasswordValid = await verifyPassword(password, userData.password);

	if (!isPasswordValid) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_PASSWORD,
			status: StatusCode.UNAUTHORIZED,
		});
	}

	const photoFileObject = userData.photo ? await findFileByKey(userData.photo) : null;

	if (photoFileObject) {
		await deleteFileFromKey(photoFileObject.key);
		await deleteFileById(photoFileObject.id);
	}

	await deleteUserById(currentUser.id);

	return NextResponse.json({ message: 'Account deleted.' });
});