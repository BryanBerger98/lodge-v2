import { ColumnDef } from '@tanstack/react-table';
import { parsePhoneNumber } from 'react-phone-number-input';

import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { UserPopulated } from '@/schemas/user/populated.schema';

const UserPhoneNumberColumn: ColumnDef<UserPopulated> = {
	id: 'phone_number',
	accessorKey: 'phone_number',
	header: ({ column }) => <ColumnHeadSort column={ column }>Phone</ColumnHeadSort>,
	cell: ({ row }) => {
		const phoneNumber = row.original.phone_number ? parsePhoneNumber(row.original.phone_number) : undefined;
		return <span>{ phoneNumber?.formatInternational() }</span>;
	},
};

export default UserPhoneNumberColumn;