import { createFile, deleteFileById, findFileById } from '@/database/file/file.repository';
import { DEFAULT_URL_EXPIRATION, deleteFileFromKey, gitFileSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { ImageMimeTypeSchema } from '@/schemas/file/mime-type.schema';
import { Setting, SettingDataType, SettingPopulated, UnregisteredSetting, UnregisteredSettingPopulated } from '@/schemas/setting';
import { UserPopulated } from '@/schemas/user/populated.schema';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';

export const uploadPhotoFile = async (currentUser: UserPopulated, photoFile?: Blob | null, setting?: SettingPopulated | Setting | UnregisteredSetting | UnregisteredSettingPopulated | null) => {
	try {
		if (!setting || setting.data_type !== SettingDataType.IMAGE) {
			throw buildApiError({
				code: ApiErrorCode.SETTING_NOT_FOUND,
				status: StatusCode.NOT_FOUND,
			});
		};
		if (photoFile) {
			const fileMimeType = ImageMimeTypeSchema.parse(photoFile.type);
			if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(fileMimeType)) {
				throw buildApiError({
					code: ApiErrorCode.WRONG_FILE_FORMAT,
					status: StatusCode.UNPROCESSABLE_ENTITY,
				});
			}
	
			if (photoFile.size > AUTHORIZED_IMAGE_SIZE) {
				throw buildApiError({
					code: ApiErrorCode.FILE_TOO_LARGE,
					status: StatusCode.UNPROCESSABLE_ENTITY,
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
			const photoUrl = await gitFileSignedURL(photoKey, DEFAULT_URL_EXPIRATION.PROFILE_PICTURE);

			const parsedFile = {
				...convertFileRequestObjetToModel(photoFile, {
					url: photoUrl,
					key: photoKey,
					expiration_date: new Date(new Date().getTime() + 3000),
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