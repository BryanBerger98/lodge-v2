// import { ILodgeFile } from '../../types/file.type';

import { SafeTokenData } from '@/types/token.type';
import fetcher from '@/utils/fetcher.util';

import { IUser } from '../types/user.type';

export const getCurrentLoggedInUser = async (): Promise<IUser> => {
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

// export const updatePassword = async (oldPassword: string, newPassword: string, csrfToken: string | null): Promise<IUser> => {
// 	try {
// 		const response = await fetcher(csrfToken).put(`${ baseUrl }/update-password`, {
// 			newPassword,
// 			oldPassword,
// 		}, {
// 			headers: { 'Content-Type': 'application/json' },
// 			withCredentials: true,
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

// export const updateEmail = async (email: string, password: string, csrfToken: string | null): Promise<IUser> => {
// 	try {
// 		const response = await fetcher(csrfToken).put(`${ baseUrl }/update-email`, {
// 			email,
// 			password,
// 		}, {
// 			headers: { 'Content-Type': 'application/json' },
// 			withCredentials: true,
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

// export const updateAvatar = async (file: File, csrfToken?: string | null): Promise<{ file: ILodgeFile, photoUrl: string }> => {
// 	try {
// 		const formData = new FormData();
// 		formData.append('avatar', file);
// 		const response = await fetcher(csrfToken).put(`${ baseUrl }/account/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// 		const { data: fileData } = response;
// 		return fileData;
// 	} catch (error) {
// 		throw error;
// 	}
// };

// export const getAvatar = async (): Promise<{ photoUrl: string }> => {
// 	try {
// 		const response = await fetcher().get(`${ baseUrl }/account/avatar`);
// 		const { data } = response;
// 		return data;
// 	} catch (error) {
// 		throw error;
// 	}
// };