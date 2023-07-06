import { Id, newId } from '@/config/database.config';
import { IToken, TokenAction } from '@/types/token.type';

import { CreateTokenDTO } from './token.dto';
import TokenModel from './token.model';

export const createToken = async (tokenToCreate: CreateTokenDTO): Promise<IToken> => {
	try {
		const createdToken = await TokenModel.create({ ...tokenToCreate });
		return createdToken.toObject();
	} catch (error) {
		throw error;
	}
};

type GetTokenFromCreatedByFilter = {
	action?: TokenAction,
	created_at?: Date,
	expiration_date?: Date,
}

export const getTokenFromCreatedBy = async (created_by: Id | string, filter?: GetTokenFromCreatedByFilter): Promise<IToken | null> => {
	try {
		const foundToken = await TokenModel.findOne({
			created_by,
			...filter,
		});
		return foundToken?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const getTokenFromTokenString = async (token: string): Promise<IToken | null> => {
	try {
		const foundToken = await TokenModel.findOne({ token });
		return foundToken?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const deleteTokenById = async (tokenId: string | Id): Promise<IToken | null> => {
	try {
		const deletedToken = await TokenModel.findByIdAndDelete(newId(tokenId));
		return deletedToken?.toObject() || null;
	} catch (error) {
		throw error;
	}
};