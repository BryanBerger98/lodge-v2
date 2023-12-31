import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { IFile } from '@/schemas/file';
import { generateUniqueNameFromFileName } from '@/utils/file.util';

export enum DEFAULT_URL_EXPIRATION {
	PROFILE_PICTURE = 7 * 24 * 60 * 60,
};

/**
 * Generate an expiration date from a number of seconds
 * @param expiration 
 * @returns 
 */
export const generateExpirationDate = (expiration: number) => {
	const MILLISECONDS = 1000;
	return new Date(new Date().getTime() + (expiration + MILLISECONDS));
};

const config = {
	credentials: {
		accessKeyId: process.env.BUCKET_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY as string,
	},
	region: process.env.BUCKET_REGION,
	apiVersion: process.env.BUCKET_POLICY_VERSION,
};

const bucket = new S3Client(config);

export const getFileFromKey = async (file: IFile) => {
	const command = new GetObjectCommand({
		Bucket: process.env.BUCKET_NAME as string,
		Key: file.key,
	});
	const res = await bucket.send(command);
	const fileBuffer = await res.Body?.transformToByteArray();
	return fileBuffer ? `data:${ file.mime_type };base64,${ Buffer.from(fileBuffer).toString('base64') }` : null;
};

export const getMultipleFiles = (files: IFile[]) => {
	const retrievedFiles = files.map(async file => {
		const command = new GetObjectCommand({
			Bucket: process.env.BUCKET_NAME as string,
			Key: file.key,
		});
		const fileData = await bucket.send(command);
		const fileBuffer = await fileData.Body?.transformToByteArray();
		return {
			fileString: fileBuffer ? `data:${ file.mime_type };base64,${ Buffer.from(fileBuffer).toString('base64') }` : null,
			key: file.key,
		};
	});
	return Promise.all(retrievedFiles);
};

export const deleteFileFromKey = async (key: string) => {
	try {
		const command = new DeleteObjectCommand({
			Bucket: process.env.BUCKET_NAME as string,
			Key: key,
		});
		await bucket.send(command);
		return;
	} catch (error) {
		throw error;
	}
};

export const deleteMultipleFilesFromKey = async (keys: string[]) => {
	try {
		const command = new DeleteObjectsCommand({
			Bucket: process.env.BUCKET_NAME as string,
			Delete: { Objects: keys.map(key => ({ Key: key })) },
		});
		await bucket.send(command);
		return;
	} catch (error) {
		throw error;
	}
};

export const uploadImageToS3 = async (file: Blob, folderPath = ''): Promise<string> => {

	const generatedFileName = await generateUniqueNameFromFileName(file.name);

	const fileBufferArray = await file.arrayBuffer();
  
	const params = {
	  Bucket: process.env.BUCKET_NAME as string,
	  Key: `${ folderPath }${ generatedFileName }`,
	  Body: Buffer.from(fileBufferArray),
	  ContentType: file.type,
	};
  
	const command = new PutObjectCommand(params);
	await bucket.send(command);
  
	return `${ folderPath }${ generatedFileName }`;
};

export const gitFileSignedURL = async (key: string, expires?: number) => {
	const command = new GetObjectCommand({
		Bucket: process.env.BUCKET_NAME as string,
		Key: key, 
	});
	const url = await getSignedUrl(bucket, command, { expiresIn: expires });
	return url;
};

export default bucket;