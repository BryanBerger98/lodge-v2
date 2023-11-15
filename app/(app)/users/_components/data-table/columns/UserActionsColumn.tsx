import { ColumnDef } from '@tanstack/react-table';

import { UserPopulated } from '@/schemas/user/populated.schema';

import UserActionsCell from '../cells/UserActionsCell';

const UserActionsColumn: ColumnDef<UserPopulated> = {
	id: 'actions',
	enableHiding: false,
	cell: ({ row }) => <UserActionsCell rowData={ row.original } />,
};

export default UserActionsColumn;