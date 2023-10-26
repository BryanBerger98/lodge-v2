import { NextRequest, NextResponse } from 'next/server';
import { object, string } from 'zod';

import { deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { findSettingByName } from '@/database/setting/setting.repository';
import { deleteUserById, findUserWithPasswordById } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltErrorWithSchemaValidation, sendError } from '@/utils/error';
import { FORBIDDEN_ERROR, INTERNAL_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
import { verifyPassword } from '@/utils/password.util';

export const POST = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		const userAccountDeletionSetting = await findSettingByName(SettingName.USER_ACCOUNT_DELETION);

		if (userAccountDeletionSetting && userAccountDeletionSetting.data_type === 'boolean' && !userAccountDeletionSetting.value) {
			return sendError(buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			}));
		}

		const deleteUserEmailSchema = object({ password: string().min(1, 'Required.') });

		const body = await request.json();
		const { password } = deleteUserEmailSchema.parse(body);

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.ADMIN, Role.USER ] });

		const userData = await findUserWithPasswordById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		if (!userData.password) {
			return sendError(buildError({
				code: INTERNAL_ERROR,
				message: 'User password not found.', // TODO: Create a dedicated error code for this.
				status: 500,
			}));
		}

		const isPasswordValid = await verifyPassword(password, userData.password);

		if (!isPasswordValid) {
			return sendError(buildError({
				message: 'Wrong password.',
				code: WRONG_PASSWORD_ERROR,
				status: 401,
			}));
		}

		const photoFileObject = userData.photo ? await findFileByKey(userData.photo) : null;

		if (photoFileObject) {
			await deleteFileFromKey(photoFileObject.key);
			await deleteFileById(photoFileObject.id);
		}

		await deleteUserById(currentUser.id);

		return NextResponse.json({ message: 'Account deleted.' });
	} catch (error: any) {
		console.error(error);
		return sendBuiltErrorWithSchemaValidation(error);
	}
};