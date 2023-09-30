import { newId } from '@/lib/database';
import { CreateLodgeFileDTO, IFile, IFilePopulated } from '@/types/file.type';
import { IUser } from '@/types/user.type';

import UserModel from '../user/user.model';

import FileModel from './file.model';

export const findFileById = async (file_id: string): Promise<IFile | null> => {
	try {
		const document = await FileModel.findById(newId(file_id));
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const findFileByKey = async (key: string): Promise<IFile | null> => {
	try {
		const document = await FileModel.findOne({ key });
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const findMultipleFilesByKey = async (keysArray: string[]): Promise<IFilePopulated[] | null> => {
	try {
		const files = await FileModel.find({ key: { $in: keysArray } })
			.populate<{
			created_by: IUser | null,
			updated_by: IUser | null,
		}>([
			{
				path: 'created_by',
				select: { password: 0 },
				model: UserModel,
			},
			{
				path: 'updated_by',
				select: { password: 0 },
				model: UserModel,
			},
		])
			.lean({ virtuals: [ 'id' ] });
		return files;
	} catch (error) {
		throw error;
	}
};

export const updateFileURL = async (fileToUpdate: { id: string, url: string, url_expiration_date?: Date }): Promise<IFile | null> => {
	try {
		const document = await FileModel.findByIdAndUpdate(newId(fileToUpdate.id), {
			$set: {
				url: fileToUpdate.url,
				url_expiration_date: fileToUpdate.url_expiration_date || null,
			},
		});
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const deleteFileById = async (file_id: string): Promise<IFile | null> => {
	try {
		const document = await FileModel.findByIdAndDelete(newId(file_id));
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const deleteMultipleFilesById = async (file_ids: string[]): Promise<number> => {
	try {
		const result = await FileModel.deleteMany({ _id: { $in: file_ids.map(id => newId(id)) } });
		return result.deletedCount;
	} catch (error) {
		throw error;
	}
};

export const createFile = async (fileToCreate: CreateLodgeFileDTO): Promise<IFile | null> => {
	try {
		const document = await FileModel.create(fileToCreate);
		return document.toObject();
	} catch (error) {
		throw error;
	}
};