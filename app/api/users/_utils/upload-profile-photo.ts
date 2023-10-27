import { createFile, deleteFileById, findFileById } from '@/database/file/file.repository';
import { deleteFileFromKey, getFieldSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { ImageMimeTypeSchema } from '@/schemas/file/mime-type.schema';
import { User } from '@/schemas/user';
import { UserPopulated } from '@/schemas/user/populated.schema';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';

export const uploadProfilePhotoFile = async (currentUser: UserPopulated, photoFile?: Blob | null, user?: User | UserPopulated) => {
	try {
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
	
			if (user && user.photo) {
				const oldFile = await findFileById(typeof user.photo === 'string' ? user.photo : user.photo.id);
				if (oldFile) {
					await deleteFileFromKey(oldFile.key);
					await deleteFileById(oldFile.id);
				}
			}

			const photoKey = await uploadImageToS3(photoFile, 'avatars/');
			const photoUrl = await getFieldSignedURL(photoKey, 24 * 60 * 60);

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