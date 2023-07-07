import { Id, newId } from '@/config/database.config';
import { CreateLodgeFileDTO, IFile } from '@/types/file.type';

import FileModel from './file.model';

export const findFileByKey = async (key: string): Promise<IFile | null> => {
	try {
		const file = await FileModel.findOne({ key });
		return file;
	} catch (error) {
		throw error;
	}
};

export const findMultipleFilesByKey = async (keysArray: string[]): Promise<IFile[] | null> => {
	try {
		const files = await FileModel.find({ key: { $in: keysArray } });
		return files;
	} catch (error) {
		throw error;
	}
};

export const deleteFileById = async (fileId: Id | string): Promise<IFile | null> => {
	try {
		const file = await FileModel.findByIdAndDelete(newId(fileId));
		return file;
	} catch (error) {
		throw error;
	}
};

export const createFile = async (fileToCreate: CreateLodgeFileDTO): Promise<IFile | null> => {
	try {
		const createdFile = await FileModel.create(fileToCreate);
		return createdFile;
	} catch (error) {
		throw error;
	}
};