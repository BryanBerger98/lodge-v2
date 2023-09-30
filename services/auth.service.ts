import fetcher from '@/lib/fetcher';
import { SafeTokenData } from '@/types/token.type';

import { IUser, IUserPopulated } from '../types/user.type';

export const getCurrentLoggedInUser = async (): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account');
		return data;
	} catch (error) {
		throw error;
	}
};

export const signUpUser = async (email: string, password: string, csrfToken?: string | null): Promise<IUser> => {
	try {
		const data = await fetcher('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const getSentEmailVerificationToken = async (): Promise<SafeTokenData> => {
	try {
		const data = await fetcher('/api/auth/verify-email');
		return data;
	} catch (error) {
		throw error;
	}
};

export const sendEmailVerificationToken = async (csrfToken: string): Promise<SafeTokenData> => {
	try {
		const data = await fetcher('/api/auth/verify-email', {
			method: 'POST',
			csrfToken, 
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const verifyUserEmail = async (token: string, csrfToken: string) => {
	try {
		const data = await fetcher('/api/auth/verify-email', {
			method: 'PUT',
			body: JSON.stringify({ token }), 
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const resetUserPassword = async (token: string, password: string, csrfToken: string) => {
	try {
		const data = await fetcher('/api/auth/reset-password', {
			method: 'PUT',
			body: JSON.stringify({
				token,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const sendResetPasswordToken = async (email: string, csrfToken: string) => {
	try {
		const data = await fetcher('/api/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify({ email }),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateAccount = async (valuesToUpdate: { phone_number?: string, username?: string }, csrfToken: string): Promise<IUser> => {
	try {
		const data = await fetcher('/api/auth/account', {
			method: 'PUT',
			body: JSON.stringify({ ...valuesToUpdate }),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async (password: string, newPassword: string, csrfToken: string | null): Promise<IUser> => {
	try {
		const data = await fetcher('/api/auth/account/password', {
			method: 'PUT',
			body: JSON.stringify({
				password,
				newPassword, 
			}),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUserEmail = async (email: string, password: string, csrfToken: string | null): Promise<IUser> => {
	try {
		const data = await fetcher('/api/auth/account/email', {
			method: 'PUT',
			body: JSON.stringify({
				email,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUserAvatar = async (file: File, csrfToken: string): Promise<IUserPopulated | null> => {
	try {
		const formData = new FormData();
		formData.append('avatar', file);
		const data = await fetcher('/api/auth/account/avatar', {
			method: 'PUT',
			body: formData,
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const getAvatar = async (): Promise<{ photoUrl: string }> => {
	try {
		const data = await fetcher('/api/auth/account/avatar');
		return data;
	} catch (error) {
		throw error;
	}
};

export const deleteUserAccount = async (csrfToken: string, password: string) => {
	try {
		await fetcher('/api/auth/account/delete', {
			method: 'POST',
			body: JSON.stringify({ password }),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return;
	} catch (error) {
		throw error;
	}
};