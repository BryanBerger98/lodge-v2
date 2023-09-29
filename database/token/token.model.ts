import { Schema, model, Types, Model, models } from 'mongoose';

import { IToken } from '@/types/token.type';

interface ITokenDocument extends Omit<IToken, 'target_id' | 'created_by'> {
	target_id: Types.ObjectId;
	created_by: Types.ObjectId | null;
}

const tokenSchema = new Schema<ITokenDocument>({
	token: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	action: {
		type: String,
		required: true,
		enum: [ 'reset_password', 'email_verification' ],
	},
	expiration_date: {
		type: Date,
		required: true,
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
	},
	target_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: false,
	},
});

tokenSchema.virtual('id').get(function getVirtualId () {
	return this._id.toHexString();
});

tokenSchema.set('toObject', { virtuals: true });
tokenSchema.set('toJSON', { virtuals: true });

const TokenModel: Model<ITokenDocument> = models.Token || model<ITokenDocument>('Token', tokenSchema);

export default TokenModel;