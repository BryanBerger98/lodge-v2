import { UserPlus, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { connectToDatabase } from '@/config/database.config';
import { findUsers } from '@/database/user/user.repository';


const DynamicUsersDataTable = dynamic(() => import('./_components/UsersDataTable'));

const UsersPage = async () => {

	await connectToDatabase();

	const users = await findUsers({}, {
		sort: { 'created_at': -1 },
		limit: 10, 
	});

	return (
		<>
			<PageTitle><Users /> Users</PageTitle>
			<div className="container">
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
								<UserPlus />
								Create user
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<DynamicUsersDataTable users={ users } />
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default UsersPage;