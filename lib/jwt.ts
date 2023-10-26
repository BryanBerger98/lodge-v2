import jwt from 'jsonwebtoken';

import { TokenAction } from '@/schemas/token.schema';
import { User, UserPopulated } from '@/schemas/user';

export const generateToken = (user: User | UserPopulated, expirationDate: Date | number, action: TokenAction) => {
	const { JWT_SECRET } = process.env;
	if (!JWT_SECRET) {
		throw new Error('No secret provided for JWT.');
	}
	const token = jwt.sign({
		email: user.email,
		exp: expirationDate ? expirationDate : Math.floor(Date.now() / 1000) + (60 * 60),
		action,
	}, JWT_SECRET);
	return token;
};

export const verifyToken = (token: string) => {
	const { JWT_SECRET } = process.env;
	if (!JWT_SECRET) {
		throw new Error('No secret provided for JWT.');
	}
	return jwt.verify(token, JWT_SECRET);
};