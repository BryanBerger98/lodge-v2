'use client';

import DataTable from '@/components/ui/data-table';
import { IUser } from '@/types/user.type';

import { columns } from './columns';

type UsersDataTableProps = {
	users: IUser[];
};

const UsersDataTable = ({ users }: UsersDataTableProps) => {

	return (
		<div>
			<DataTable
				columns={ columns }
				data={ users }
			/>
		</div>
	);
};

export default UsersDataTable;