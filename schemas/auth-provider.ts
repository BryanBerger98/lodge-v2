import { z } from 'zod';

export enum AuthProvider {
	EMAIL = 'email',
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	GITHUB = 'github',
	MICROSOFT = 'microsoft',
	APPLE = 'apple',
	SLACK = 'slack',
	DISCORD = 'discord',
};

export const AuthProviderSchema = z.nativeEnum(AuthProvider);