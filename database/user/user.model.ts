import { Schema, model, models, Model } from 'mongoose';

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
	photo_url: { type: String },
	is_disabled: {
		type: Boolean,
		default: false,
	},
	provider_data: { type: String },
	created_at: {
		type: Date,
		default: new Date(),
	},
	updated_at: {
		type: Date,
		default: null,
	},
	last_login_date: {
		type: Date,
		default: null,
	},
});

const UserModel: Model<IUserWithPassword> = models.User || model<IUserWithPassword>('User', userSchema);

export default UserModel;