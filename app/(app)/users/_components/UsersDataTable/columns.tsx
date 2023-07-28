import { CheckedState } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, BadgeCheck, BadgeX } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Id } from '@/lib/database';
import { UserRoleWithOwner } from '@/types/user.type';

import RowMenu from './RowMenu';

export type UserColumn = {
  id: string | Id;
  username: string;
  email: string;
  is_disabled: boolean;
  has_email_verified: boolean;
  role: UserRoleWithOwner;
  created_at: Date;
}

export const COLUMN_NAMES = {
	username: 'username',
	email: 'email',
	is_disabled: 'status',
	has_email_verified: 'email verified',
	role: 'role',
	created_at: 'created at',
};

export const columns: ColumnDef<UserColumn>[] = [
	{
		id: 'select',
		header: ({ table }) => {
			const handleCheckedChange = (value: CheckedState) => table.toggleAllPageRowsSelected(!!value);
			return (
				<Checkbox
					aria-label="Select all"
					checked={ table.getIsAllPageRowsSelected() }
					onCheckedChange={ handleCheckedChange }
				/>
			);
		},
		cell: ({ row }) => {
			const handleCheckedChange = (value: CheckedState) => row.toggleSelected(!!value);
			return (
				<Checkbox
					aria-label="Select row"
					checked={ row.getIsSelected() }
					data-emit-row-click="false"
					onCheckedChange={ handleCheckedChange }
				/>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
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
				variant={ row.original.role === 'owner' ? 'destructive' : row.original.role === 'admin' ? 'default' : 'secondary' }
			>{ row.original.role }
			</Badge>
		),
	},
	{
		id: 'is_disabled',
		accessorKey: 'is_disabled',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			const sortState = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Status
					{ sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" /> }
				</Button>
			);
		},
		cell: ({ row }) => <Badge variant={ row.original.is_disabled ? 'destructive' : 'secondary' }>{ row.original.is_disabled ? 'Disabled' : 'Enabled' }</Badge>,
	},
	{
		id: 'created_at',
		accessorKey: 'created_at',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			const sortState = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Created at
					{ sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" /> }
				</Button>
			);
		},
		cell: ({ row }) => <span>{ new Date(row.original.created_at).toLocaleDateString('fr') } { new Date(row.original.created_at).toLocaleTimeString('fr') }</span>,
	},
	{
		id: 'actions',
    	enableHiding: false,
		cell: ({ row }) => <RowMenu rowData={ row.original } />,
	},
];
