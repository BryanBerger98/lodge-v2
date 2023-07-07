import { Home, Layers, MessagesSquare, Users } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CurrentUserAvatar from '@/components/features/users/CurrentUserAvatar';

import { Button } from '../../ui/button';


type SidebarProps = {
	className?: string;
}

const Sidebar = async ({ className }: SidebarProps) => {
	
	const session = await getServerSession(authOptions);

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
							><Home size="16" /> Dashboard
							</Button>
						</li>
						<li>
							<Button
								className="w-full gap-2 justify-start"
								variant="ghost"
							><Users size="16" /> Users
							</Button>
						</li>
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
							<p className="text-xs font-semibold">{ session?.user?.username || <span className="italic">User</span> }</p>
						</div>
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default Sidebar;