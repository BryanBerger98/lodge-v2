import { ColumnDef } from '@tanstack/react-table';

import { IUserPopulated } from '@/schemas/user/populated.schema';

import UserActionsColumn from './UserActionsColumn';
import UserAuthProviderColumn from './UserAuthProviderColumn';
import UserCreatedAtColumn from './UserCreatedAtColumn';
import UserDisabledStatusColumn from './UserDisabledStatusColumn';
import UserEmailColumn from './UserEmailColumn';
import UserNameColumn from './UserNameColumn';
import UserPhoneNumberColumn from './UserPhoneNumberColumn';
import UserRoleColumn from './UserRoleColumn';
import UserSelectColumn from './UserSelectColumn';

export const COLUMN_NAMES = {
	'last_name': 'Name',
	'email': 'Email',
	'phone_number': 'Phone',
	'provider_data': 'Provider',
	'role': 'Role',
	'is_disabled': 'Status',
	'created_at': 'Created at',
};

export const columns: ColumnDef<IUserPopulated>[] = [
	UserSelectColumn,
	UserNameColumn,
	UserEmailColumn,
	UserPhoneNumberColumn,
	UserAuthProviderColumn,
	UserRoleColumn,
	UserDisabledStatusColumn,
	UserCreatedAtColumn,
	UserActionsColumn,
];