import crypto from 'crypto';
import path from 'path';

import imageCompression from 'browser-image-compression';

import { IFile, ImageMimetype } from '../types/file.type';

const imageMimetypes: string[] = [ 'image/gif', 'image/jpeg', 'image/png', 'image/webp' ] as ImageMimetype[];

export const AUTHORIZED_IMAGE_MIME_TYPES = [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ];
export const AUTHORIZED_IMAGE_SIZE = 1024 * 1024 * 1; // 1 MB

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

export const convertFileRequestObjetToModel = (fileObj: File | Blob, fileData: { key: string, url: string, expiration_date?: Date }): Omit<IFile, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'updated_by'> => {
	return {
		original_name: fileObj.name,
		custom_name: fileObj.name,
		mimetype: fileObj.type,
		extension: getFileExtension(fileObj.name),
		size: fileObj.size,
		key: fileData.key,
		url: fileData.url,
		url_expiration_date: fileData.expiration_date || null,
	};
};

export const checkIfFileIsAnImage = (fileType: string): fileType is ImageMimetype => {
	return typeof fileType === 'string' && imageMimetypes.includes(fileType);
};

type ImageOptimizationOptions = {
	maxSizeMB?: number;
	maxWidthOrHeight?: number;
}

export const optimizeImage = async (fileImage: File, options?: ImageOptimizationOptions): Promise<File> => {
	try {
		const compressedFile = await imageCompression(fileImage, {
			maxSizeMB: options?.maxSizeMB || 0.512,
			maxWidthOrHeight: options?.maxWidthOrHeight || 500,
		});

		return compressedFile;
	} catch (error) {
		throw error;
	}
};