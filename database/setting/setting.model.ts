import { Schema, model, Types, Model, models } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { SettingArrayOfObjectIds, SettingArrayOfStrings, SettingBase, SettingBoolean, SettingDataType, SettingDate, SettingImage, SettingNumber, SettingObjectId, SettingString } from '@/schemas/setting';

import FileModel from '../file/file.model';
import UserModel from '../user/user.model';


interface ISettingBaseDocument extends Omit<SettingBase, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
}

interface IStringSettingDocument extends Omit<SettingString, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingBooleanDocument extends Omit<SettingBoolean, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingDateDocument extends Omit<SettingDate, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingImageDocument extends Omit<SettingImage, 'created_by' | 'updated_by' | 'value'> {
	value: Types.ObjectId | null;
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingNumberDocument extends Omit<SettingNumber, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingObjectIdDocument extends Omit<SettingObjectId, 'created_by' | 'updated_by' | 'value'> {
	value: Types.ObjectId | null;
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingArrayOfStringsDocument extends Omit<SettingArrayOfStrings, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
};

interface ISettingArrayOfObjectIdsDocument extends Omit<SettingArrayOfObjectIds, 'created_by' | 'updated_by' | 'value'> {
	value: Types.ObjectId[] | null;
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

const arrayOfStringsSettingSchema = new Schema<ISettingArrayOfStringsDocument>({
	value: {
		type: [ String ],
		required: true,
	},
}, { discriminatorKey: 'data_type' });

const arrayOfObjectIdsSettingSchema = new Schema<ISettingArrayOfObjectIdsDocument>({
	value: {
		type: [ Schema.Types.ObjectId ],
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

settingSchema.set('toObject', { virtuals: true });
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
export const ArrayOfStringsSettingModel: Model<ISettingArrayOfStringsDocument> = SettingModel.discriminators?.array_of_strings || SettingModel.discriminator('array_of_strings', arrayOfStringsSettingSchema);
export const ArrayOfObjectIdsSettingModel: Model<ISettingArrayOfObjectIdsDocument> = SettingModel.discriminators?.array_of_object_ids || SettingModel.discriminator('array_of_object_ids', arrayOfObjectIdsSettingSchema);

const SettingModels = {
	[ SettingDataType.STRING ]: StringSettingModel,
	[ SettingDataType.BOOLEAN ]: BooleanSettingModel,
	[ SettingDataType.DATE ]: DateSettingModel,
	[ SettingDataType.IMAGE ]: ImageSettingModel,
	[ SettingDataType.NUMBER ]: NumberSettingModel,
	[ SettingDataType.OBJECT_ID ]: ObjectIdSettingModel,
	[ SettingDataType.ARRAY_OF_STRINGS ]: ArrayOfStringsSettingModel,
	[ SettingDataType.ARRAY_OF_OBJECT_IDS ]: ArrayOfObjectIdsSettingModel,
	default: SettingModel,
} as const;


export const getSettingModel = (dataType: SettingDataType) => {
	switch (dataType) {
		case SettingDataType.STRING:
			return StringSettingModel;
		case SettingDataType.BOOLEAN:
			return BooleanSettingModel;
		case SettingDataType.DATE:
			return DateSettingModel;
		case SettingDataType.IMAGE:
			return ImageSettingModel;
		case SettingDataType.NUMBER:
			return NumberSettingModel;
		case SettingDataType.OBJECT_ID:
			return ObjectIdSettingModel;
		case SettingDataType.ARRAY_OF_STRINGS:
			return ArrayOfStringsSettingModel;
		case SettingDataType.ARRAY_OF_OBJECT_IDS:
			return ArrayOfObjectIdsSettingModel;
		default:
			return SettingModel;
	}
};

export default SettingModels;