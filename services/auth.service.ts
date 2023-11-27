import { z } from 'zod';

import { UpdateUserAccountSchema } from '@/app/api/auth/account/_schemas/update-user-account.schema';
import fetcher, { FetcherOptionsWithCsrf } from '@/lib/fetcher';
import { ISafeToken, SafeTokenSchema } from '@/schemas/token.schema';
import { User, UserSchema } from '@/schemas/user';
import { IUserPopulated, UserPopulatedSchema } from '@/schemas/user/populated.schema';

export const getCurrentLoggedInUser = async (): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account');
		return UserPopulatedSchema.parse(data);
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
		return UserSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const getSentEmailVerificationToken = async (): Promise<ISafeToken> => {
	try {
		const data = await fetcher('/api/auth/verify-email');
		return SafeTokenSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const sendEmailVerificationToken = async (options: FetcherOptionsWithCsrf): Promise<ISafeToken> => {
	try {
		const data = await fetcher('/api/auth/verify-email', {
			method: 'POST',
			...options,
		});
		return SafeTokenSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const verifyUserEmail = async (token: string, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/auth/verify-email', {
			method: 'PUT',
			body: JSON.stringify({ token }), 
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const resetUserPassword = async ({ password, token }: { token: string, password: string }, options: FetcherOptionsWithCsrf): Promise<{ message: string }> => {
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
		return z.object({ message: z.string() }).parse(data);
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

export const updateAccount = async (valuesToUpdate: z.infer<typeof UpdateUserAccountSchema>, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account', {
			method: 'PUT',
			body: JSON.stringify({ ...valuesToUpdate }),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async ({ password, newPassword }: { password: string, newPassword: string }, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
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
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const updateUserEmail = async ({ email, password }: { email: string, password: string }, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account/email', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const confirmNewUserEmail = async (token: string, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/auth/account/email', {
			method: 'PUT',
			body: JSON.stringify({ token }), 
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const updateUserAvatar = async (file: File, options: FetcherOptionsWithCsrf): Promise<IUserPopulated | null> => {
	try {
		const formData = new FormData();
		formData.append('avatar', file);
		const data = await fetcher('/api/auth/account/avatar', {
			method: 'PUT',
			body: formData,
			...options,
		});
		return UserPopulatedSchema.or(z.null()).parse(data);
	} catch (error) {
		throw error;
	}
};

export const deleteUserAccount = async (password: string, options: FetcherOptionsWithCsrf): Promise<{ message: string }> => {
	try {
		const data = await fetcher('/api/auth/account/delete', {
			method: 'POST',
			body: JSON.stringify({ password }),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return z.object({ message: z.string() }).parse(data);
	} catch (error) {
		throw error;
	}
};