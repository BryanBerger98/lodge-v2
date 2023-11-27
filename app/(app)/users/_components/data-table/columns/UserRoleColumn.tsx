import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { IUserPopulated } from '@/schemas/user/populated.schema';


const UserRoleColumn: ColumnDef<IUserPopulated> = {
	id: 'role',
	accessorKey: 'role',
	header: ({ column }) => <ColumnHeadSort column={ column }>Role</ColumnHeadSort>,
	cell: ({ row }) => (
		<Badge
			className="capitalize"
			variant={ row.original.role === 'owner' ? 'destructive' : row.original.role === 'admin' ? 'default' : 'secondary' }
		>{ row.original.role }
		</Badge>
	),
};

export default UserRoleColumn;