'use client';

import { Home, Settings, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import CurrentUserAvatar from '@/app/_components/CurrentUserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useAuth from '@/context/auth/useAuth';
import useBreakPoint from '@/hooks/utils/useBreakPoint';
import { Env, isProductionEnv } from '@/utils/env.util';
import { SETTINGS_ACTIONS } from '@/utils/roles/settings.permissions';
import { USERS_ACTIONS } from '@/utils/roles/users.permissions';

import useSidebar from './useSidebar';

const Sidebar = () => {

	const { isOpen, setIsOpen, brandName, logoUrl, hasSettingsAccess } = useSidebar();
	const { currentUser, can } = useAuth();

	const breakPoint = useBreakPoint();

	const handleToggleSidebar = () => {
		setIsOpen(prevState => !prevState);
	};

	return 	isOpen || [ '2xl', 'xl', 'lg', 'md' ].includes(breakPoint.size) ?
		<div className="w-screen md:w-[248px] py-8 bg-white h-screen fixed top-0 left-0 bottom-0 z-50">
			<div className="h-full border-r-[1px] border-slate-200 px-6 flex flex-col gap-8">
				<div className="flex gap-4 justify-between items-center">
					<div className="flex flex-col gap-2">
						<Link href="/">
							{
								logoUrl ?
									<div className="w-32 h-10 relative">
										<Image
											alt="Brand logo"
											className="object-contain"
											src={ logoUrl }
											fill
										/>
									</div>
									: <p className="text-3xl font-medium flex gap-2 items-center">{ brandName } </p>
							}
						</Link>
						{
							!isProductionEnv(Env.NEXT_PUBLIC_ENVIRONMENT) ?
								<Badge
									className="w-fit"
									variant="destructive"
								>{ Env.NEXT_PUBLIC_ENVIRONMENT }
								</Badge>
								: null
						}
					</div>
					<Button
						className="md:hidden"
						variant="ghost"
						onClick={ handleToggleSidebar }
					>
						<X size="24" />
					</Button>
				</div>
				<nav>
					<ul className="flex flex-col">
						<li>
							<Button
								className="w-full gap-2 justify-start"
								variant="ghost"
								asChild
							>
								<Link href="/">
									<Home size="16" /> Dashboard
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
						{
							hasSettingsAccess && can(SETTINGS_ACTIONS.GET_SETTINGS) ?
								<li>
									<Button
										className="w-full gap-2 justify-start"
										variant="ghost"
										asChild
									>
										<Link href="/settings">
											<Settings size="16" /> Settings
										</Link>
									</Button>
								</li>
								: null
						}
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
		: null;

};

export default Sidebar;