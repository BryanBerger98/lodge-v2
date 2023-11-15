import { ColumnDef } from '@tanstack/react-table';
import dynamic from 'next/dynamic';

import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { UserPopulated } from '@/schemas/user/populated.schema';

const UserCreatedAtCell = dynamic(() => import('../cells/UserCreatedAtCell'), { ssr: false });

const UserCreatedAtColumn: ColumnDef<UserPopulated> = 	{
	id: 'created_at',
	accessorKey: 'created_at',
	header: ({ column }) => <ColumnHeadSort column={ column }>Created at</ColumnHeadSort>,
	cell: ({ row }) => <UserCreatedAtCell rowData={ row.original } />,
};

export default UserCreatedAtColumn;