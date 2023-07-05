import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
	const hashedPassword = await hash(password, 12);
	return hashedPassword;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	const isPasswordValid = await compare(password, hashedPassword);
	return isPasswordValid;
};

export const generatePassword = (passwordLength: number): string => {
	const minimumPasswordLength = passwordLength && passwordLength > 8 ? passwordLength : 12;
	const passwordCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&-_/$*!?=.+^';
	let generatedPassword = '';
	for (let i = 0, n = passwordCharset.length; i < minimumPasswordLength; ++i) {
		generatedPassword += passwordCharset.charAt(Math.floor(Math.random() * n));
	}
	return generatedPassword;
};