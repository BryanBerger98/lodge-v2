import { newId } from '@/lib/database';
import { IToken, TokenAction } from '@/types/token.type';

import { CreateTokenDTO } from './token.dto';
import TokenModel from './token.model';

export const createToken = async (tokenToCreate: CreateTokenDTO): Promise<IToken> => {
	try {
		const createdToken = await TokenModel.create({
			...tokenToCreate,
			target_id: newId(tokenToCreate.target_id),
			created_by: tokenToCreate.created_by ? newId(tokenToCreate.created_by) : tokenToCreate.created_by, 
		});
		return createdToken.toObject();
	} catch (error) {
		throw error;
	}
};

type GetTokenFromTargetIdFilter = {
	action?: TokenAction,
	created_at?: Date,
	created_by?: string,
	expiration_date?: Date,
}

export const getTokenFromTargetId = async (target_id: string, filter?: GetTokenFromTargetIdFilter): Promise<IToken | null> => {
	try {
		const foundToken = await TokenModel.findOne({
			target_id: newId(target_id),
			...filter,
			created_by: filter?.created_by ? newId(filter.created_by) : filter?.created_by,
		});
		return foundToken?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

type GetTokenFromCreatedByFilter = {
	action?: TokenAction,
	created_at?: Date,
	target_id?: string,
	expiration_date?: Date,
}

export const getTokenFromCreatedBy = async (created_by: string, filter?: GetTokenFromCreatedByFilter): Promise<IToken | null> => {
	try {
		const foundToken = await TokenModel.findOne({
			created_by: newId(created_by),
			...filter,
			target_id: filter?.target_id ? newId(filter.target_id) : filter?.target_id,
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

export const deleteTokenById = async (token_id: string): Promise<IToken | null> => {
	try {
		const deletedToken = await TokenModel.findByIdAndDelete(newId(token_id));
		return deletedToken?.toObject() || null;
	} catch (error) {
		throw error;
	}
};