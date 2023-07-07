import { Schema, model, models, Model, Types } from 'mongoose';

import { IFile } from '@/types/file.type';

const fileSchema = new Schema<IFile>({
	original_name: {
		type: String,
		default: '',
	},
	custom_name: {
		type: String,
		default: '',
	},
	mimetype: {
		type: String,
		default: '',
	},
	extension: {
		type: String,
		default: '',
	},
	size: {
		type: Number,
		default: 0,
	},
	key: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	updated_by: {
		type: Types.ObjectId,
		default: null,
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
	},
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
});

const FileModel: Model<IFile> = models.File || model<IFile>('File', fileSchema);

export default FileModel;