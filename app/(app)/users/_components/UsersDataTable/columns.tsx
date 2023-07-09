import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, BadgeCheck, BadgeX } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Id } from '@/config/database.config';

import Menu from './Menu';

export type UserColumn = {
  id: string | Id
  username: string
  email: string
  is_disabled: boolean,
  has_email_verified: boolean,
}

export const columns: ColumnDef<UserColumn>[] = [
	{
		id: 'username',
		accessorKey: 'username',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Username
					<ArrowUpDown className="ml-2 h-4 w-4" />
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
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
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
