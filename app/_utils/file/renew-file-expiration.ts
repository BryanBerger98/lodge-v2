import { updateFileURL } from '@/database/file/file.repository';
import { DEFAULT_URL_EXPIRATION, generateExpirationDate, gitFileSignedURL } from '@/lib/bucket';
import { IFile } from '@/schemas/file';

type RenewFileExpirationOptions = {
	expiration?: number;
};

export const renewFileExpiration = async (file: IFile | null, options?: RenewFileExpirationOptions): Promise<IFile | null> => {
	const { expiration = DEFAULT_URL_EXPIRATION.PROFILE_PICTURE } = options || {};

	if (file && file.url_expiration_date && file.url_expiration_date < new Date()) {
		const photoUrl = await gitFileSignedURL(file.key, expiration);
		const updatedFile = await updateFileURL({
			id: file.id,
			url: photoUrl,
			url_expiration_date: generateExpirationDate(expiration),
		});
		return updatedFile;
	}

	return file;
};