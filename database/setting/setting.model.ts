import { Schema, model, Types, Model, models } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { ISettingBase, ISettingString, ISettingBoolean, ISettingDate, ISettingImage, ISettingNumber, ISettingObjectId } from '@/types/setting.type';

import FileModel from '../file/file.model';
import UserModel from '../user/user.model';

interface ISettingBaseDocument extends Omit<ISettingBase, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
}

interface IStringSettingDocument extends Omit<ISettingString, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingBooleanDocument extends Omit<ISettingBoolean, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingDateDocument extends Omit<ISettingDate, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingImageDocument extends Omit<ISettingImage, 'created_by' | 'updated_by' | 'value'> {
	value: Types.ObjectId | null;
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingNumberDocument extends Omit<ISettingNumber, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingObjectIdDocument extends Omit<ISettingObjectId, 'created_by' | 'updated_by' | 'value'> {
	value: Types.ObjectId | null;
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

const stringSettingSchema = new Schema<IStringSettingDocument>({
	value: {
		type: String,
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const booleanSettingSchema = new Schema<ISettingBooleanDocument>({
	value: {
		type: Boolean,
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const dateSettingSchema = new Schema<ISettingDateDocument>({
	value: {
		type: Date,
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const imageSettingSchema = new Schema<ISettingImageDocument>({
	value: {
		type: Schema.Types.ObjectId,
		ref: FileModel,
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const numberSettingSchema = new Schema<ISettingNumberDocument>({
	value: {
		type: Number,
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const objectIdSettingSchema = new Schema<ISettingObjectIdDocument>({
	value: {
		type: Schema.Types.ObjectId,
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const settingSchema = new Schema<ISettingBaseDocument>({
	name: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	value: {
		type: Schema.Types.Mixed,
		required: true,
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
		ref: UserModel,
	},
	updated_by: {
		type: Types.ObjectId,
		default: null,
		ref: UserModel,
	},
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
	discriminatorKey: 'data_type',
});

settingSchema.virtual('id').get(function getVirtualId() {
	return this._id.toHexString();
});

settingSchema.set('toObject', {
	virtuals: true,
	flattenObjectIds: true,
	versionKey: false, 
});
settingSchema.set('toJSON', {
	virtuals: true,
	flattenObjectIds: true,
	versionKey: false, 
});

settingSchema.plugin(mongooseLeanVirtuals);

export const SettingModel: Model<ISettingBaseDocument> = models.Setting || model<ISettingBaseDocument>('Setting', settingSchema);

export const StringSettingModel: Model<IStringSettingDocument> = SettingModel.discriminators?.string || SettingModel.discriminator('string', stringSettingSchema);
export const BooleanSettingModel: Model<ISettingBooleanDocument> = SettingModel.discriminators?.boolean || SettingModel.discriminator('boolean', booleanSettingSchema);
export const DateSettingModel: Model<ISettingDateDocument> = SettingModel.discriminators?.date || SettingModel.discriminator('date', dateSettingSchema);
export const ImageSettingModel: Model<ISettingImageDocument> = SettingModel.discriminators?.image || SettingModel.discriminator('image', imageSettingSchema);
export const NumberSettingModel: Model<ISettingNumberDocument> = SettingModel.discriminators?.number || SettingModel.discriminator('number', numberSettingSchema);
export const ObjectIdSettingModel: Model<ISettingObjectIdDocument> = SettingModel.discriminators?.object_id || SettingModel.discriminator('object_id', objectIdSettingSchema);

const SettingModels = {
	string: StringSettingModel,
	boolean: BooleanSettingModel,
	date: DateSettingModel,
	image: ImageSettingModel,
	number: NumberSettingModel,
	object_id: ObjectIdSettingModel,
	default: SettingModel,
} as const;

export default SettingModels;