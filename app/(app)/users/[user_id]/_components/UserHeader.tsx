'use client';

import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import useUser from '@/context/users/user/useUser';
import { Role } from '@/schemas/role.schema';

import Menu from './Menu';

const UserHeader = () => {

	const { user } = useUser();

	if (!user) return null;

	return (
		<Card>
			<CardHeader className="flex-row gap-4 items-center">
				<Avatar className="w-16 h-16">
					<AvatarImage
						alt="Profile"
						src={ user.photo?.url }
					/>
					<AvatarFallback><User /></AvatarFallback>
				</Avatar>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>{ user.first_name && user.last_name ? user.first_name + ' ' + user.last_name : user.username ? user.username : <span className="italic text-slate-500">No username</span> }</CardTitle>
					<div className="flex gap-2">
						<Badge
							className="capitalize"
							variant={ user.role === Role.OWNER ? 'destructive' : user.role === Role.ADMIN ? 'default' : 'secondary' }
						>{ user.role }
						</Badge>
						<Badge
							variant="secondary"
						>{ user.email }
						</Badge>
					</div>
				</div>
				<div className="ml-auto mb-auto self-start flex gap-4">
					<Menu />
				</div>
			</CardHeader>
		</Card>
	);
};

export default UserHeader;