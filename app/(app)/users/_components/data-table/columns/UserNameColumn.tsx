import { ColumnDef } from '@tanstack/react-table';
import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { UserPopulated } from '@/schemas/user/populated.schema';


const UserNameColumn: ColumnDef<UserPopulated> = {
	id: 'last_name',
	accessorKey: 'last_name',
	header: ({ column }) => <ColumnHeadSort column={ column }>Name</ColumnHeadSort>,
	cell: ({ row }) => (
		<span className="flex gap-2 items-center">
			<Avatar className="w-8 h-8">
				<AvatarImage
					alt="Profile"
					src={ row.original.photo?.url || undefined }
				/>
				<AvatarFallback><User size="16" /></AvatarFallback>
			</Avatar>
			{ row.original.first_name && row.original.last_name ? row.original.first_name + ' ' + row.original.last_name : row.original.username ? row.original.username : <span className="italic text-slate-500">No username</span> }
		</span>
	),
};

export default UserNameColumn;