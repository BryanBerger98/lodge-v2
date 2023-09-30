import { Schema, model, models, Model, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { AuthProviders, IUserWithPassword, UserRolesWithOwner } from '@/types/user.type';

import FileModel from '../file/file.model';

interface IUserWithPasswordDocument extends Omit<IUserWithPassword, 'created_by' | 'updated_by' | 'photo'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
	photo: Types.ObjectId | null;
}

const userSchema = new Schema<IUserWithPasswordDocument>({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		index: true,
	},
	has_email_verified: {
		type: Boolean,
		default: false,
	},
	password: { type: String },
	role: {
		type: String,
		enum: UserRolesWithOwner,
		default: 'user',
	},
	username: { type: String },
	phone_number: { type: String },
	photo: {
		type: Schema.Types.ObjectId,
		default: null,
		ref: FileModel,
	},
	is_disabled: {
		type: Boolean,
		default: false,
	},
	provider_data: {
		type: String,
		enum: AuthProviders,
		default: 'email',
	},
	updated_by: {
		type: Schema.Types.ObjectId,
		default: null,
		ref: 'User',
	},
	created_by: {
		type: Schema.Types.ObjectId,
		default: null,
		ref: 'User',
	},
	last_login_date: {
		type: Date,
		default: null,
	},
	has_password: { type: Boolean },
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
	id: false,
});

userSchema.virtual('id').get(function getVirtualId () {
	return this._id.toHexString();
});

userSchema.set('toObject', {
	virtuals: true,
	flattenObjectIds: true,
	versionKey: false, 
});
userSchema.set('toJSON', {
	virtuals: true,
	flattenObjectIds: true,
	versionKey: false, 
});

userSchema.plugin(mongooseLeanVirtuals);

const UserModel: Model<IUserWithPasswordDocument> = models.User || model<IUserWithPasswordDocument>('User', userSchema);

export default UserModel;