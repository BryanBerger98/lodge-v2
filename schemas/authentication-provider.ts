import { z } from 'zod';

export enum AuthenticationProvider {
	EMAIL = 'email',
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	GITHUB = 'github',
	MICROSOFT = 'microsoft',
	APPLE = 'apple',
	SLACK = 'slack',
	DISCORD = 'discord',
};

export const AuthenticationProviderSchema = z.nativeEnum(AuthenticationProvider);