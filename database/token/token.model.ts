import { Schema, model, Types, Model, models } from 'mongoose';

import { IToken } from '@/types/token.type';

const tokenSchema = new Schema<IToken>({
	token: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	action: {
		type: String,
		required: true,
		enum: [ 'reset_password', 'account_verification' ],
	},
	expiration_date: {
		type: Date,
		required: true,
	},
	created_at: {
		type: Date,
		default: new Date(),
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
	},
});

const TokenModel: Model<IToken> = models.Token || model<IToken>('Token', tokenSchema);

export default TokenModel;