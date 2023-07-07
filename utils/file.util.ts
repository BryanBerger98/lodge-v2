import crypto from 'crypto';
import path from 'path';

import { IFile, ImageMimetype } from '../types/file.type';

const imageMimetypes: string[] = [ 'image/gif', 'image/jpeg', 'image/png', 'image/webp' ] as ImageMimetype[];

export const AUTHORIZED_IMAGE_MIME_TYPES = [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ];
export const AUTHORIZED_IMAGE_SIZE = 1024 * 1024 * 2; // 2 MB

export const getFileExtension = (fileName: string) => fileName.split('.').pop();

export const generateUniqueNameFromFileName = (filename: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		crypto.pseudoRandomBytes(16, (err, raw) => {
			if (err) {
				return reject(err);
			}
			const generatedName = raw.toString('hex') + '-' + path.basename(filename).replace(/\s/g, '');
			resolve(generatedName);
		});
	});
};

export const convertFileRequestObjetToModel = (fileObj: File | Blob, fileKey: string): Omit<IFile, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'updated_by'> => {

	const file = {
		original_name: fileObj.name,
		custom_name: fileObj.name,
		mimetype: fileObj.type,
		extension: getFileExtension(fileObj.name),
		size: fileObj.size,
		key: fileKey,
	};
	return file;
};

export const checkIfFileIsAnImage = (fileType: string): fileType is ImageMimetype => {
	return typeof fileType === 'string' && imageMimetypes.includes(fileType);
};