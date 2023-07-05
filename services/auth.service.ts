// import fetcher from '../../lib/fetcher';
// import { ILodgeFile } from '../../types/file.type';
import { ZodError } from 'zod';

import fetcher from '@/utils/fetcher.util';

import { IUser } from '../types/user.type';

export const getCurrentLoggedInUser = async (): Promise<IUser> => {
	try {
		const response = await fetch('/api/auth/account');
		const data = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
};

export const signUpUser = async (email: string, password: string, csrfToken?: string | null): Promise<{ data: IUser | null, error?: ZodError | string }> => {
	try {
		const data = await fetcher(csrfToken)('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
		});
		if (data.name === 'zodError') {
			return {
				error: data as ZodError,
				data: null, 
			};
		}
		if (data.status !== 201) {
			return {
				error: data.message,
				data: null,
			};
		}
		return { data };
	} catch (error) {
		throw error;
	}
};

// export const resetPassword = async (token: string, password: string, csrfToken: string | null) => {
// 	try {
// 		const response = await fetcher(csrfToken).put(`${ baseUrl }/reset-password`, {
// 			token,
// 			password,
// 		}, {
// 			withCredentials: true,
// 			headers: { 'Content-Type': 'application/json' },
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };


// export const sendResetPasswordEmailToUserByEmail = async (email: string, csrfToken: string | null) => {
// 	try {
// 		const response = await fetcher(csrfToken).post(`${ baseUrl }/reset-password`, { email }, {
// 			withCredentials: true,
// 			headers: { 'Content-Type': 'application/json' },
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

// export const sendVerifyAccountEmailToUser = async () => {
// 	try {
// 		const response = await fetcher().get(`${ baseUrl }/verify-email`, { withCredentials: true });
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

// export const verifyEmail = async (token: string) => {
// 	try {
// 		const response = await fetcher().put(`${ baseUrl }/verify-email`, { token }, {
// 			headers: { 'Content-Type': 'application/json' },
// 			withCredentials: true,
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

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

// export const updateAccount = async (valuesToUpdate: { phone_number?: string, username?: string }, csrfToken: string | null): Promise<IUser> => {
// 	try {
// 		const response = await fetcher(csrfToken).put(`${ baseUrl }/account`, valuesToUpdate, {
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