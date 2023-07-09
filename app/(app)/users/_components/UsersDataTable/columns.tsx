import { ColumnDef } from '@tanstack/react-table';

import { Id } from '@/config/database.config';

export type UserColumn = {
  id: string | Id
  username: string
  email: string
  is_disabled: boolean
}

export const columns: ColumnDef<UserColumn>[] = [
	{
		accessorKey: 'username',
		header: 'Username',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'is_disabled',
		header: 'Status',
	},
];
