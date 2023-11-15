import { Plus, UserPlus, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';
import { z } from 'zod';

import { renewFileExpiration } from '@/app/_utils/file/renew-file-expiration';
import { FetchUsersSchema } from '@/app/api/users/_schemas/fetch-users.schema';
import PageTitle from '@/components/layout/Header/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CsrfProvider from '@/context/csrf/csrf.provider';
import { findUsers, findUsersCount } from '@/database/user/user.repository';
import { getCsrfToken } from '@/lib/csrf';
import { connectToDatabase } from '@/lib/database';
import { UserPopulatedSchema } from '@/schemas/user/populated.schema';
import { isFileURLExpired } from '@/utils/file.util';

import UsersProvider from './_context/users/users.provider';

const UsersDataTable = dynamic(() => import('./_components/data-table'));

type UsersPageProps = {
	searchParams?: { [key: string]: string | string[] | undefined };
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {

	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const { sort_fields, sort_directions, page_index, page_size, search } = FetchUsersSchema.parse(searchParams);

	const searchArray = search ? search.trim().split(' ') : [];
	const searchRegexArray = searchArray.map(string => new RegExp(string, 'i'));
	const searchRequest = searchRegexArray.length > 0 ? { $or: [ { username: { $in: searchRegexArray } }, { email: { $in: searchRegexArray } } ] } : {};

	let users = await findUsers(searchRequest, {
		sort: Object.fromEntries(sort_fields.map((field, index) => [ field, sort_directions[ index ] as 1 | -1 ])),
		skip: Math.round(page_index * page_size),
		limit: page_size,
	});

	const expiredFiles = isFileURLExpired(...users.map(user => user.photo));

	if (expiredFiles.length > 0) {
		await Promise.all(expiredFiles.map(async (file) => await renewFileExpiration(file)));
		users = await findUsers(searchRequest, {
			sort: Object.fromEntries(sort_fields.map((field, index) => [ field, sort_directions[ index ] as 1 | -1 ])),
			skip: Math.round(page_index * page_size),
			limit: page_size,
		});
	}
	
	const totalUsers = await findUsersCount(searchRequest);
	const disabledUsersCount = await findUsersCount({
		...searchRequest,
		is_disabled: true, 
	});
	const verifiedUsersCount = await findUsersCount({
		...searchRequest,
		has_email_verified: true, 
	});
	const unverifiedUsersCount = await findUsersCount({
		...searchRequest,
		has_email_verified: false, 
	});
	const parsedUsers = z.array(UserPopulatedSchema).parse(users);

	return (
		<CsrfProvider csrfToken={ csrfToken }>
			<UsersProvider
				total={ totalUsers }
				users={ parsedUsers }
			>
				<PageTitle
					headerButton={ {
						asChild: true,
						variant: 'ghost',
						children: <Link href="/users/new"><Plus /></Link>,
					} }
				><Users /> Users
				</PageTitle>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardHeader>
							<CardTitle>{ totalUsers }</CardTitle>
							<CardDescription>Registered user{ totalUsers > 1 ? 's' : '' }</CardDescription>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>{ verifiedUsersCount }</CardTitle>
							<CardDescription>Verified user{ verifiedUsersCount > 1 ? 's' : '' }</CardDescription>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>{ unverifiedUsersCount }</CardTitle>
							<CardDescription>Unverified user{ unverifiedUsersCount > 1 ? 's' : '' }</CardDescription>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>{ disabledUsersCount }</CardTitle>
							<CardDescription>Disabled user{ disabledUsersCount > 1 ? 's' : '' }</CardDescription>
						</CardHeader>
					</Card>
				</div>
				<Card>
					<CardHeader className="flex-row justify-between items-start">
						<div>
							<CardTitle>Manage users</CardTitle>
							<CardDescription>
								Manage users accounts, permissions and roles.
							</CardDescription>
						</div>
						<Button
							className="hidden md:flex gap-2 items-center"
							asChild
						>
							<Link href="/users/new">
								<UserPlus size="16" />
								Create user
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<UsersDataTable />
					</CardContent>
				</Card>
			</UsersProvider>
		</CsrfProvider>
	);
};

export default UsersPage;