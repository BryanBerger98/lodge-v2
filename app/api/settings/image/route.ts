import { NextRequest, NextResponse } from 'next/server';

import { createFile, deleteFileById, findFileById } from '@/database/file/file.repository';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { deleteFileFromKey, getFieldSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { ImageMimeTypeSchema } from '@/schemas/file/mime-type.schema';
import { Role } from '@/schemas/role.schema';
import { Setting, SettingDataType, SettingName, SettingPopulated, UnregisteredSetting, UnregisteredSettingPopulated } from '@/schemas/setting';
import { UserPopulated } from '@/schemas/user/populated.schema';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltErrorWithSchemaValidation } from '@/utils/error';
import { FILE_TOO_LARGE_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';

import { UpdateImageSettingSchema } from '../_schemas/update-image.setting.schema';

const uploadPhotoFile = async (currentUser: UserPopulated, photoFile?: Blob | null, setting?: SettingPopulated | Setting | UnregisteredSetting | UnregisteredSettingPopulated | null) => {
	try {
		if (!setting || setting.data_type !== SettingDataType.IMAGE) {
			throw buildError({
				code: 'SETTING_NOT_FOUND',
				message: 'Setting not found.',
				status: 404,
			});
		};
		if (photoFile) {
			const fileMimeType = ImageMimeTypeSchema.parse(photoFile.type);
			if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(fileMimeType)) {
				throw buildError({
					code: WRONG_FILE_FORMAT_ERROR,
					message: 'Wrong file format.',
					status: 422,
				});
			}
	
			if (photoFile.size > AUTHORIZED_IMAGE_SIZE) {
				throw buildError({
					code: FILE_TOO_LARGE_ERROR,
					message: 'The file is too large.',
					status: 422,
				});
			}
	
			if (setting.value && typeof setting.value !== 'string' && 'id' in setting.value && setting.value.id) {
				const oldFile = await findFileById(setting.value.id);
				if (oldFile) {
					await deleteFileFromKey(oldFile.key);
					await deleteFileById(oldFile.id);
				}
			}

			const photoKey = await uploadImageToS3(photoFile, 'branding/');
			const photoUrl = await getFieldSignedURL(photoKey);

			const parsedFile = {
				...convertFileRequestObjetToModel(photoFile, {
					url: photoUrl,
					key: photoKey,
				}),
				created_by: currentUser.id,
			};
	
			const savedFile = await createFile(parsedFile);
	
			return savedFile;
		}
		return null;
	} catch (error) {
		throw error;
	}
};

export const PUT = async (request: NextRequest) => {
	try {
		
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
	} catch (error: any) {
		console.error(error);
		sendBuiltErrorWithSchemaValidation(error);
	}
};