import { NextResponse } from 'next/server';

import { deleteMultipleFilesById, findMultipleFilesByKey } from '@/database/file/file.repository';
import { deleteMultipleUsersById, findUsers } from '@/database/user/user.repository';
import { deleteMultipleFilesFromKey } from '@/lib/bucket';
import { connectToDatabase, newId } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { filterEmptyValues } from '@/utils/array.util';
import { setServerAuthGuard } from '@/utils/auth';

export const DELETE = routeHandler(async (_, { params }) => {
	const { user_ids } = params;

	if (!user_ids) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User ids are missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const userIdsArr = user_ids.trim().split(',').filter(el => el);

	if (!userIdsArr || userIdsArr.length === 0) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User ids are missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	await connectToDatabase();

	await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

	const usersData = await findUsers({
		_id: { $in: userIdsArr.map(id => newId(id)) },
		role: { $ne: 'owner' },
	});

	if (!usersData || usersData.length === 0) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const photoKeys = usersData.map(user => user.photo?.key).filter(filterEmptyValues).filter(key => key);
	const photoFileObjects = photoKeys.length > 0 ? await findMultipleFilesByKey(photoKeys) : null;
	const photoFileObjectKeys = photoFileObjects ? photoFileObjects.map(photoFile => photoFile.key).filter(key => key) : [];

	if (photoFileObjectKeys && photoFileObjectKeys.length > 0 && photoFileObjects && photoFileObjects.length > 0) {
		await deleteMultipleFilesFromKey(photoFileObjectKeys);
		const photoFileObjectIds = photoFileObjects.map(photoFile => photoFile.id).filter(id => id);
		await deleteMultipleFilesById(photoFileObjectIds);
	}

	const userDataIds = usersData.map(user => user.id).filter(id => id);

	await deleteMultipleUsersById(userDataIds);

	return NextResponse.json({ message: 'Users deleted.' });
});