import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { IUserPopulated } from '@/schemas/user/populated.schema';

const UserDisabledStatusColumn: ColumnDef<IUserPopulated> = {
	id: 'is_disabled',
	accessorKey: 'is_disabled',
	header: ({ column }) => <ColumnHeadSort column={ column }>Status</ColumnHeadSort>,
	cell: ({ row }) => <Badge variant={ row.original.is_disabled ? 'destructive' : 'secondary' }>{ row.original.is_disabled ? 'Disabled' : 'Enabled' }</Badge>,
};

export default UserDisabledStatusColumn;