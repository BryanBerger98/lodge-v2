import { Schema, model, models, Model, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { AuthProviders, IUserWithPassword, UserRolesWithOwner } from '@/types/user.type';

const userSchema = new Schema<IUserWithPassword>({
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
	photo_url: {
		type: String,
		default: null, 
	},
	photo_key: {
		type: String,
		default: null, 
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
		type: Types.ObjectId,
		default: null,
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
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

// eslint-disable-next-line func-names
userSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

userSchema.set('toObject', { virtuals: true });

userSchema.plugin(mongooseLeanVirtuals);

const UserModel: Model<IUserWithPassword> = models.User || model<IUserWithPassword>('User', userSchema);

export default UserModel;