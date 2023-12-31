import { Schema, model, models, Model, Types } from 'mongoose';

import { IFile } from '@/schemas/file';
import { MimeType } from '@/schemas/file/mime-type.schema';

interface IFileDocument extends Omit<IFile, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
}

const fileSchema = new Schema<IFileDocument>({
	original_name: {
		type: String,
		default: '',
	},
	custom_name: {
		type: String,
		default: '',
	},
	mime_type: {
		type: String,
		enum: MimeType,
		default: MimeType.UNKNOWN,
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
	url: {
		type: String,
		default: '',
		trim: true,
	},
	url_expiration_date: {
		type: Date,
		default: null,
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

fileSchema.virtual('id').get(function getVirtualId () {
	return this._id.toHexString();
});

fileSchema.set('toObject', { virtuals: true });
fileSchema.set('toJSON', {
	virtuals: true,
	flattenObjectIds: true,
	versionKey: false, 
});

const FileModel: Model<IFileDocument> = models.File || model<IFileDocument>('File', fileSchema);

export default FileModel;