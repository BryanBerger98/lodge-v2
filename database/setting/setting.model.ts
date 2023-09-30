import { Schema, model, Types, Model, models } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { ISetting, SettingTypes } from '@/types/setting.type';

interface ISettingDocument extends Omit<ISetting, 'created_by' | 'updated_by'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
}

const settingSchema = new Schema<ISettingDocument>({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	value: {
		type: Schema.Types.Mixed,
		required: true,
	},
	data_type: {
		type: String,
		enum: SettingTypes,
		required: true,
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
	},
	updated_by: {
		type: Types.ObjectId,
		default: null,
	},
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
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

const SettingModel: Model<ISettingDocument> = models.Setting || model<ISettingDocument>('Setting', settingSchema);

export default SettingModel;