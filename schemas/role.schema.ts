import { z } from 'zod';

export enum Role {
	USER = 'user',
	ADMIN = 'admin',
	OWNER = 'owner',
};

export const RoleSchema = z.nativeEnum(Role);