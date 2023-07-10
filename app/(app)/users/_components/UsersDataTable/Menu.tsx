import { ArrowRightLeft, BadgeCheck, CircleOff, Edit, KeyRound, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { UserColumn } from './columns';

type MenuProps = {
	rowData: UserColumn;
}

const Menu = ({ rowData }: MenuProps) => {

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="h-8 w-8 p-0"
					variant="ghost"
				>
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					className="gap-2 hover:cursor-pointer"
					asChild
				>
					<Link href={ `/users/edit/${ rowData.id }` }>
						<Edit size="16" />
						Edit
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 hover:cursor-pointer"
					disabled
				><KeyRound size="16" /> Send reset password
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 hover:cursor-pointer"
					disabled
				><BadgeCheck size="16" /> Send email verification
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 hover:cursor-pointer"
					disabled
				><ArrowRightLeft size="16" /> Impersonate
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="gap-2 text-red-500 hover:cursor-pointer"
					disabled
				><CircleOff size="16" /> Suspend
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 text-red-500 hover:cursor-pointer"
					disabled
				><Trash size="16" /> Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Menu;