import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, BadgeCheck, BadgeX } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Id } from '@/config/database.config';
import { UserRole } from '@/types/user.type';

import Menu from './Menu';

export type UserColumn = {
  id: string | Id
  username: string
  email: string
  is_disabled: boolean,
  has_email_verified: boolean,
  role: UserRole;
}

export const columns: ColumnDef<UserColumn>[] = [
	{
		id: 'username',
		accessorKey: 'username',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			const sortState = column.getIsSorted();
			return (
				<Button
					className="group"
					variant="ghost"
					onClick={ handleSort }
				>
					Username
					{ sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" /> }
				</Button>
			);
		},
		cell: ({ row }) => row.original.username ? row.original.username : <span className="italic text-slate-500">No username</span>,
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			const sortState = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Email
					{ sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" /> }
				</Button>
			);
		},
		cell: ({ row }) => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<span className="flex gap-2 items-center">

							{
								row.original.has_email_verified ?
									<BadgeCheck
										className="text-green-500"
										size="16"
									/>
									:
									<BadgeX
										className="text-red-500"
										size="16"
									/>
							}
							{ row.original.email }
						</span>
					</TooltipTrigger>
					<TooltipContent>
						{ row.original.has_email_verified ? 'Email verified' : 'Email not verified' }
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
	},
	{
		id: 'role',
		accessorKey: 'role',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			const sortState = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Role
					{ sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" /> }
				</Button>
			);
		},
		cell: ({ row }) => (
			<Badge
				className="capitalize"
				variant={ row.original.role === 'admin' ? 'default' : 'secondary' }
			>{ row.original.role }
			</Badge>
		),
	},
	{
		id: 'status',
		accessorKey: 'is_disabled',
		header: 'Status',
		cell: ({ row }) => <Badge variant={ row.original.is_disabled ? 'destructive' : 'secondary' }>{ row.original.is_disabled ? 'Disabled' : 'Enabled' }</Badge>,
	},
	{
		id: 'actions',
    	enableHiding: false,
		cell: ({ row }) => <Menu rowData={ row.original } />,
	},
];
