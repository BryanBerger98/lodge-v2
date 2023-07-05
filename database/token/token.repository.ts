import { Id } from '@/config/database.config';
import { IToken } from '@/types/token.type';

import { CreateTokenDTO } from './token.dto';
import TokenModel from './token.model';

export const createToken = async (tokenToCreate: CreateTokenDTO): Promise<IToken> => {
	try {
		const createdToken = await TokenModel.create({ ...tokenToCreate });
		return createdToken;
	} catch (error) {
		throw error;
	}
};

export const getTokenFromTokenString = async (token: string): Promise<IToken | null> => {
	try {
		const foundToken = await TokenModel.findOne({ token });
		return foundToken;
	} catch (error) {
		throw error;
	}
};

export const deleteTokenById = async (tokenId: string | Id): Promise<IToken | null> => {
	try {
		const deletedToken = await TokenModel.findByIdAndDelete(tokenId);
		return deletedToken;
	} catch (error) {
		throw error;
	}
};