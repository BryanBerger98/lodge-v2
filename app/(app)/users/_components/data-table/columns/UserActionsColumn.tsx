import { ColumnDef } from '@tanstack/react-table';

import { IUserPopulated } from '@/schemas/user/populated.schema';

import UserActionsCell from '../cells/UserActionsCell';

const UserActionsColumn: ColumnDef<IUserPopulated> = {
	id: 'actions',
	enableHiding: false,
	cell: ({ row }) => <UserActionsCell rowData={ row.original } />,
};

export default UserActionsColumn;