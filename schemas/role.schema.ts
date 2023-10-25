import { z } from 'zod';

export enum Role {
	USER = 'user',
	ADMIN = 'admin',
};

export enum RoleWithOwner {
	USER = 'user',
	ADMIN = 'admin',
	OWNER = 'owner',
};

export const RoleSchema = z.nativeEnum(Role);
export const RoleWithOwnerSchema = z.nativeEnum(RoleWithOwner);