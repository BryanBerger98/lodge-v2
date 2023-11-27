import { CheckedState } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { IUserPopulated } from '@/schemas/user/populated.schema';

const UserSelectColumn: ColumnDef<IUserPopulated> = {
	id: 'select',
	header: ({ table }) => {
		const handleCheckedChange = (value: CheckedState) => table.toggleAllPageRowsSelected(!!value);
		return (
			<Checkbox
				aria-label="Select all"
				checked={ table.getIsAllPageRowsSelected() }
				onCheckedChange={ handleCheckedChange }
			/>
		);
	},
	cell: ({ row }) => {
		const handleCheckedChange = (value: CheckedState) => row.toggleSelected(!!value);
		return (
			<Checkbox
				aria-label="Select row"
				checked={ row.getIsSelected() }
				data-emit-row-click="false"
				onCheckedChange={ handleCheckedChange }
			/>
		);
	},
	enableSorting: false,
	enableHiding: false,
};

export default UserSelectColumn;