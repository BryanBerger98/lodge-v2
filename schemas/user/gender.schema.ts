import { z } from 'zod';

export enum Gender {
	MALE = 'male',
	FEMALE = 'female',
	UNSPECIFIED = 'unspecified',
};

export const GenderSchema = z.nativeEnum(Gender);