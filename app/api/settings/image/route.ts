import { NextRequest, NextResponse } from 'next/server';

import { createFile, deleteFileById, findFileById } from '@/database/file/file.repository';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { deleteFileFromKey, getFieldSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { ISettingImage, ISettingImagePopulated, IUnregisteredSettingImage, IUnregisteredSettingImagePopulated } from '@/types/setting.type';
import { IUserPopulated } from '@/types/user.type';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltErrorWithSchemaValidation } from '@/utils/error';
import { FILE_TOO_LARGE_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';
import { SETTING_NAMES } from '@/utils/settings';

import { UpdateImageSettingSchema } from '../_schemas/update-image.setting.schema';

const uploadPhotoFile = async (currentUser: IUserPopulated, photoFile?: Blob | null, setting?: ISettingImagePopulated | ISettingImage | IUnregisteredSettingImage | IUnregisteredSettingImagePopulated | null) => {
	try {
		if (photoFile) {
			if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(photoFile.type)) {
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
	
			if (setting && setting.value) {
				if (typeof setting.value === 'string' || (typeof setting.value !== 'string' && setting.value.id)) {
					const oldFile = await findFileById((typeof setting.value === 'string' ? setting.value : setting.value.id) as string);
					if (oldFile) {
						await deleteFileFromKey(oldFile.key);
						await deleteFileById(oldFile.id);
					}
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

		const shareWithAdminSetting = await findSettingByName(SETTING_NAMES.SHARE_WITH_ADMIN_SETTING);

		const rolesWhiteList: ('admin' | 'owner')[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ 'owner', 'admin' ] : [ 'owner' ];

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList });

		const formData = await request.formData();

		const { name, value } = UpdateImageSettingSchema.parse(Object.fromEntries(formData.entries()));

		const settingData = await findSettingByName(name); // Should retreive the populated setting with file image

		const photoFileData = await uploadPhotoFile(currentUser, value, settingData);

		const updatedSetting = await updateSetting({
			...settingData,
			name,
			data_type: 'image',
			value: photoFileData?.id || settingData?.value?.id || null,
			updated_by: currentUser.id,
		}, { upsert: true });
		
		return NextResponse.json(updatedSetting);
	} catch (error: any) {
		console.error(error);
		sendBuiltErrorWithSchemaValidation(error);
	}
};