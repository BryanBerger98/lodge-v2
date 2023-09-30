import { IUser } from './user.type';

export type ImageMimetype = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';

export interface IFile {
	id: string;
	original_name: string;
	custom_name: string;
	mimetype: string;
	extension?: string;
	size: number;
	key: string;
	created_at: Date;
	updated_at: Date | null;
	created_by: string | null;
	updated_by: string | null;
}

export interface IFilePopulated extends Omit<IFile, 'created_by' | 'updated_by'> {
	created_by: IUser | null;
	updated_by: IUser | null;
}

export type CreateLodgeFileDTO = Omit<IFile, 'id' | 'created_at' | 'updated_at' | 'updated_by'>