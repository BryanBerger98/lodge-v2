import { Schema, model, models, Model, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { AuthProvider } from '@/schemas/auth-provider';
import { RoleWithOwner } from '@/schemas/role.schema';
import { UserWithPassword } from '@/schemas/user';
import { Gender } from '@/schemas/user/gender.schema';

import FileModel from '../file/file.model';

interface IUserWithPasswordDocument extends Omit<UserWithPassword, 'created_by' | 'updated_by' | 'photo'> {
	created_by: Types.ObjectId | null;
	updated_by: Types.ObjectId | null;
	photo: Types.ObjectId | null;
};

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
	role: {
		type: String,
		enum: RoleWithOwner,
		default: RoleWithOwner.USER,
	},
	first_name: { type: String },
	last_name: { type: String },
	birth_date: {
		type: Date,
		default: null, 
	},
	username: { type: String },
	display_name: {
		type: String,
		default: null, 
	},
	gender: {
		type: String,
		enum: Gender,
		default: Gender.UNSPECIFIED,
	},
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
		enum: AuthProvider,
		default: AuthProvider.EMAIL,
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
	password: {
		type: String,
		default: null, 
	},
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

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', {
	virtuals: true,
	flattenObjectIds: true,
	versionKey: false, 
});

userSchema.plugin(mongooseLeanVirtuals);

const UserModel: Model<IUserWithPasswordDocument> = models.User || model<IUserWithPasswordDocument>('User', userSchema);

export default UserModel;