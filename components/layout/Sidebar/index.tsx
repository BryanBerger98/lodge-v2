'use client';

import { Layers, MessagesSquare, Users } from 'lucide-react';
import Link from 'next/link';

import CurrentUserAvatar from '@/components/features/users/CurrentUserAvatar';
import useAuth from '@/context/auth/useAuth';
import { USERS_ACTIONS } from '@/utils/role.util';

import { Button } from '../../ui/button';


type SidebarProps = {
	className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {

	const { currentUser, can } = useAuth(); 

	return (
		<div className={ `w-[200px] py-8 bg-white/50 h-screen fixed top-0 left-0 bottom-0 ${ className }` }>
			<div className="h-full border-r-[1px] border-slate-200 px-6 flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<p className="text-3xl font-medium flex gap-2 items-center"><Layers size="32" /> Lodge</p>
				</div>
				<nav>
					<ul className="flex flex-col gap-2">
						<li>
							<Button
								className="w-full gap-2 justify-start"
								variant="ghost"
								asChild
							>
								<Link href="/">
									<Users size="16" /> Dashboard
								</Link>
							</Button>
						</li>
						{
							can(USERS_ACTIONS.GET_USERS) ?
								<li>
									<Button
										className="w-full gap-2 justify-start"
										variant="ghost"
										asChild
									>
										<Link href="/users">
											<Users size="16" /> Users
										</Link>
									</Button>
								</li>
								: null
						}
						<li>
							<Button
								className="w-full gap-2 justify-start"
								variant="ghost"
							><MessagesSquare size="16" /> Messages
							</Button>
						</li>
					</ul>
				</nav>
				<Button
					className="w-full gap-4 justify-start h-fit py-4 px-6 mt-auto"
					variant="outline"
					asChild
				>
					<Link href="/account">
						<CurrentUserAvatar />
						<div className="flex flex-col gap-1 text-left">
							<p className="text-xs font-semibold">{ currentUser?.username || <span className="italic">User</span> }</p>
						</div>
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default Sidebar;