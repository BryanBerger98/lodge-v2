import { NextResponse } from 'next/server';

import { deleteMultipleFilesById, findMultipleFilesByKey } from '@/database/file/file.repository';
import { deleteMultipleUsersById, findUsers } from '@/database/user/user.repository';
import { deleteMultipleFilesFromKey } from '@/lib/bucket';
import { connectToDatabase, newId } from '@/lib/database';
import { filterEmptyValues } from '@/utils/array.util';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltError } from '@/utils/error';
import { INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

export const DELETE = async (_: any, { params }: { params: { user_ids: string } }) => {
	try {

		const { user_ids } = params;

		if (!user_ids) {
			throw buildError({
				code: INVALID_INPUT_ERROR,
				message: 'User ids are missing.',
				status: 422,
			});
		}

		const userIdsArr = user_ids.trim().split(',').filter(el => el);

		if (!userIdsArr || userIdsArr.length === 0) {
			throw buildError({
				code: INVALID_INPUT_ERROR,
				message: 'User ids are missing.',
				status: 422,
			});
		}

		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ 'owner', 'admin' ] });

		const usersData = await findUsers({
			_id: { $in: userIdsArr.map(id => newId(id)) },
			role: { $ne: 'owner' },
		});

		if (!usersData || usersData.length === 0) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'Users not found.',
				status: 404,
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
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
	}
};