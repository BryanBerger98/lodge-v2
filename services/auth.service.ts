import fetcher, { FetcherOptionsWithCsrf } from '@/lib/fetcher';
import { SafeToken } from '@/schemas/token.schema';
import { User } from '@/schemas/user';
import { UserPopulated } from '@/schemas/user/populated.schema';

export const getCurrentLoggedInUser = async (): Promise<UserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account');
		return data;
	} catch (error) {
		throw error;
	}
};

export const signUpUser = async ({ email, password }: { email: string, password: string }, options: FetcherOptionsWithCsrf): Promise<User> => {
	try {
		const data = await fetcher('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const getSentEmailVerificationToken = async (): Promise<SafeToken> => {
	try {
		const data = await fetcher('/api/auth/verify-email');
		return data;
	} catch (error) {
		throw error;
	}
};

export const sendEmailVerificationToken = async (options: FetcherOptionsWithCsrf): Promise<SafeToken> => {
	try {
		const data = await fetcher('/api/auth/verify-email', {
			method: 'POST',
			...options,
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

export const resetUserPassword = async ({ password, token }: { token: string, password: string }, options: FetcherOptionsWithCsrf) => {
	try {
		const data = await fetcher('/api/auth/reset-password', {
			method: 'PUT',
			body: JSON.stringify({
				token,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const sendResetPasswordToken = async (email: string, options: FetcherOptionsWithCsrf) => {
	try {
		const data = await fetcher('/api/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify({ email }),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateAccount = async (valuesToUpdate: { phone_number?: string, username?: string }, options: FetcherOptionsWithCsrf): Promise<UserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account', {
			method: 'PUT',
			body: JSON.stringify({ ...valuesToUpdate }),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async ({ password, newPassword }: { password: string, newPassword: string }, options: FetcherOptionsWithCsrf): Promise<UserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account/password', {
			method: 'PUT',
			body: JSON.stringify({
				password,
				newPassword, 
			}),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUserEmail = async ({ email, password }: { email: string, password: string }, options: FetcherOptionsWithCsrf): Promise<UserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account/email', {
			method: 'PUT',
			body: JSON.stringify({
				email,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUserAvatar = async (file: File, options: FetcherOptionsWithCsrf): Promise<UserPopulated | null> => {
	try {
		const formData = new FormData();
		formData.append('avatar', file);
		const data = await fetcher('/api/auth/account/avatar', {
			method: 'PUT',
			body: formData,
			...options,
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

export const deleteUserAccount = async (password: string, options: FetcherOptionsWithCsrf) => {
	try {
		await fetcher('/api/auth/account/delete', {
			method: 'POST',
			body: JSON.stringify({ password }),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return;
	} catch (error) {
		throw error;
	}
};