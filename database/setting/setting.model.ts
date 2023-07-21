import { Schema, model, Types, Model, models } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { ISetting, SettingTypes } from '@/types/setting.type';

const settingSchema = new Schema<ISetting>({
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

// eslint-disable-next-line func-names
settingSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

settingSchema.set('toObject', { virtuals: true });

settingSchema.plugin(mongooseLeanVirtuals);

const SettingModel: Model<ISetting> = models.Setting || model<ISetting>('Setting', settingSchema);

export default SettingModel;