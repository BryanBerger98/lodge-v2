import { UserPlus, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';

import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { connectToDatabase } from '@/config/database.config';
import UsersProvider from '@/context/users';
import { findUsers, findUsersCount } from '@/database/user/user.repository';
import { getCsrfToken } from '@/utils/csrf.util';

import Providers from './_components/Providers';


const DynamicUsersDataTable = dynamic(() => import('./_components/UsersDataTable'));

const UsersPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const users = await findUsers({}, {
		sort: { 'created_at': -1 },
		limit: 10, 
	});
	const totalUsers = await findUsersCount({});
	const disabledUsersCount = await findUsersCount({ is_disabled: true });
	const verifiedUsersCount = await findUsersCount({ has_email_verified: true });
	const unverifiedUsersCount = await findUsersCount({ has_email_verified: false });
	const parsedUsers = JSON.parse(JSON.stringify(users));

	return (
		<>
			<PageTitle><Users /> Users</PageTitle>
			<Providers>
				<UsersProvider users={ users }>
					<div className="container">
						<div className="grid grid-cols-4 gap-4 mb-8">
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
									className="gap-2 items-center"
									asChild
								>
									<Link href="/users/create">
										<UserPlus size="16" />
										Create user
									</Link>
								</Button>
							</CardHeader>
							<CardContent>
								<DynamicUsersDataTable
									csrfToken={ csrfToken }
									total={ totalUsers }
									users={ parsedUsers }
								/>
							</CardContent>
						</Card>
					</div>
				</UsersProvider>
			</Providers>
		</>
	);
};

export default UsersPage;