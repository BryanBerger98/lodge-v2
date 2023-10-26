import crypto from 'crypto';
import path from 'path';

import imageCompression from 'browser-image-compression';

import { IFile } from '@/schemas/file';
import { ImageMimeType, MimeTypeSchema } from '@/schemas/file/mime-type.schema';

export const AUTHORIZED_IMAGE_MIME_TYPES = [ ImageMimeType.JPEG, ImageMimeType.PNG, ImageMimeType.GIF, ImageMimeType.WEBP ];
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
	const fileMimeType = MimeTypeSchema.parse(fileObj.type);
	return {
		original_name: fileObj.name,
		custom_name: fileObj.name,
		mime_type: fileMimeType,
		extension: getFileExtension(fileObj.name),
		size: fileObj.size,
		key: fileData.key,
		url: fileData.url,
		url_expiration_date: fileData.expiration_date || null,
	};
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

export const isFileURLExpired = (...files: (IFile | null)[]): IFile[] => {
	const currentDate = new Date();

	return files.filter((file) => {
		if (file && file.url_expiration_date) {
			return currentDate.getTime() > file.url_expiration_date.getTime();
		}
		return false;
	}) as IFile[];
};