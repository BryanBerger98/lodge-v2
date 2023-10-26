import { PopulateOptions } from 'mongoose';

export const populateFile: PopulateOptions[] = [
	{
		path: 'created_by',
		select: { password: 0 },
	},
	{
		path: 'updated_by',
		select: { password: 0 },
	},
];