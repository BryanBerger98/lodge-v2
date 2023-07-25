'use client';

import { Home, Layers, Menu, Settings, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import CurrentUserAvatar from '@/components/features/users/CurrentUserAvatar';
import useAuth from '@/context/auth/useAuth';
import HeaderButton from '@/context/layout/header/HeaderButton';
import useHeader from '@/context/layout/header/useHeader';
import useBreakPoint from '@/hooks/utils/useBreakPoint';
import { SETTINGS_ACTIONS, USERS_ACTIONS } from '@/utils/role.util';

import { Button } from '../../ui/button';


type SidebarProps = {
	className?: string;
	hasSettingsAccess: boolean;
}

const Sidebar = ({ className, hasSettingsAccess }: SidebarProps) => {

	const [ isOpen, setIsOpen ] = useState(false);

	const breakPoint = useBreakPoint();
	const pathname = usePathname();

	console.log(breakPoint);

	useEffect(() => {
		if ([ 'sm', 'xs' ].includes(breakPoint.size)) {
			setIsOpen(false);
		}
	}, [ pathname, breakPoint ]);

	const handleToggleSidebar = () => {
		setIsOpen(prevState => !prevState);
	};

	const { currentUser, can } = useAuth(); 

	const { title: headerTitle, buttonProps } = useHeader();

	return (
		<>
			<div className="bg-white drop-shadow-sm p-4 flex md:hidden justify-center relative">
				<Button
					className="absolute left-2 top-2 bottom-2"
					variant="ghost"
					onClick={ handleToggleSidebar }
				>
					<Menu size="24" />
				</Button>
				<p className="text-xl font-medium flex gap-2 items-center">{ headerTitle ? headerTitle : <><Layers size="24" /> Lodge</> }</p>
				{
					buttonProps ?
						<HeaderButton
							{ ...buttonProps }
							className={ `absolute right-2 top-2 bottom-2 ${ buttonProps.className || '' }` }
							variant={ buttonProps.variant || 'ghost' }
						/>
						: null
				}
			</div>
			{
				isOpen || [ '2xl', 'xl', 'lg', 'md' ].includes(breakPoint.size) ?
					<div className={ `w-screen md:w-[200px] py-8 bg-white h-screen fixed top-0 left-0 bottom-0 z-50 ${ className }` }>
						<div className="h-full border-r-[1px] border-slate-200 px-6 flex flex-col gap-8">
							<div className="flex gap-4 justify-between items-center">
								<p className="text-3xl font-medium flex gap-2 items-center"><Layers size="32" /> Lodge</p>
								<Button
									className="md:hidden"
									variant="ghost"
									onClick={ handleToggleSidebar }
								>
									<X size="24" />
								</Button>
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
					: null
			}
		</>
	);
};

export default Sidebar;