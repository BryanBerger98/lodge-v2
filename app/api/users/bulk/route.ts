import { NextResponse } from 'next/server';

import { findOwnerUser, updateMultipleUsers } from '@/database/user/user.repository';
import { Role } from '@/schemas/role.schema';
import { routeHandler } from '@/utils/api';

import { UpdateMultipleUsersSchema } from '../_schemas/update-multiple-users.schema';

export const PUT = routeHandler(async (request, { currentUser }) => {

	const body = await request.json();
	const parsedBody = UpdateMultipleUsersSchema.parse(body);

	const ownerUser = await findOwnerUser();

	const modifiedCount = await updateMultipleUsers(
		parsedBody
			.filter(user => user.id !== ownerUser?.id)
			.map(user => ({
				...user,
				updated_by: currentUser.id, 
			}))
	);

	return NextResponse.json({ modifiedCount });
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});