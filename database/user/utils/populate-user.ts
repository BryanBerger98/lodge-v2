import { PopulateOptions } from 'mongoose';

export const populateUser: PopulateOptions[] = [
	{
		path: 'created_by',
		select: { password: 0 },
	},
	{
		path: 'updated_by',
		select: { password: 0 },
	},
	{ path: 'photo' },
];