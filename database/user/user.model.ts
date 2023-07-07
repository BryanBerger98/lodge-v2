import { Schema, model, models, Model, Types } from 'mongoose';

import { IUserWithPassword } from '@/types/user.type';

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
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: [ 'admin', 'user' ],
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
	provider_data: { type: String },
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
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
});

userSchema.set('toObject', { virtuals: true });

const UserModel: Model<IUserWithPassword> = models.User || model<IUserWithPassword>('User', userSchema);

export default UserModel;