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

type PasswordRules = {
	uppercase_min?: number;
	lowercase_min?: number;
	numbers_min?: number;
	symbols_min?: number;
	min_length?: number;
	should_contain_unique_chars?: boolean;
};

export const validatePassword = (password: string, rules: PasswordRules) => {
	return {
		is_uppercase_valid: rules.uppercase_min && rules.uppercase_min > 0 ? new RegExp(`^(?=.*[A-Z]{${ rules.uppercase_min },}).*$`).test(password) : true,
		is_lowercase_valid: rules.lowercase_min && rules.lowercase_min > 0 ? new RegExp(`^(?=.*[a-z]{${ rules.lowercase_min },}).*$`).test(password) : true,
		is_numbers_valid: rules.numbers_min && rules.numbers_min > 0 ? new RegExp(`^(?=.*[0-9]{${ rules.numbers_min },}).*$`).test(password) : true,
		is_symbols_valid: rules.symbols_min && rules.symbols_min > 0 ? new RegExp(`^(?=.*[#?!@$%^&*-]{${ rules.symbols_min },}).*$`).test(password) : true,
		is_length_valid: rules.min_length && rules.min_length > 0 ? new RegExp(`^(?=^.{${ rules.min_length },}).*$`).test(password) : true,
		is_unique_chards_valid: rules.should_contain_unique_chars ? new RegExp('^(?!.*(.).*\\1).*$').test(password) : true,
	};
};

export const getValidationRegexFromPasswordRules = (rules: PasswordRules) => {

	let regexStr = '';

	if (rules.uppercase_min && rules.uppercase_min > 0) {
		regexStr += `(?=.*[A-Z]{${ rules.uppercase_min },})`;
	}

	if (rules.lowercase_min && rules.lowercase_min > 0) {
		regexStr += `(?=.*[a-z]{${ rules.lowercase_min },})`;
	}

	if (rules.numbers_min && rules.numbers_min > 0) {
		regexStr += `(?=.*[0-9]{${ rules.numbers_min },})`;
	}

	if (rules.symbols_min && rules.symbols_min > 0) {
		regexStr += `(?=.*[#?!@$%^&*-]{${ rules.symbols_min },})`;
	}

	if (rules.min_length && rules.min_length > 0) {
		regexStr += `(?=^.{${ rules.min_length },})`;
	}

	if (rules.should_contain_unique_chars) {
		regexStr += '(?!.*(.).*\\1)';
	}

	return new RegExp(`^${ regexStr }.*$`);

};

export const getErrorMessageFromPasswordRules = (rules: PasswordRules) => {

	let message = `Password must contain ${ !rules.should_contain_unique_chars ? 'at least ': '' }`;

	if (rules.uppercase_min && rules.uppercase_min > 0) {
		message += `${ rules.uppercase_min } uppercase${ rules.uppercase_min > 1 ? 's' : '' }, `;
	}

	if (rules.lowercase_min && rules.lowercase_min > 0) {
		message += `${ rules.lowercase_min } lowercase${ rules.lowercase_min > 1 ? 's' : '' }, `;
	}

	if (rules.numbers_min && rules.numbers_min > 0) {
		message += `${ rules.numbers_min } number${ rules.numbers_min > 1 ? 's' : '' }, `;
	}

	if (rules.symbols_min && rules.symbols_min > 0) {
		message += `${ rules.symbols_min } special char${ rules.symbols_min > 1 ? 's' : '' }, `;
	}

	if (rules.min_length && rules.min_length > 0) {
		message += `${ rules.min_length } chars${ rules.should_contain_unique_chars ? '' : '.' }`;
	}

	if (rules.should_contain_unique_chars) {
		message += ', only unique chars.';
	}

	return message;

};