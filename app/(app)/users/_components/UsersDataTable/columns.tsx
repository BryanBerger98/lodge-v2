import { CheckedState } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { AppleIcon, ArrowDown, ArrowUp, ArrowUpDown, BadgeCheck, BadgeX, KeyRound, Mail, User } from 'lucide-react';

import GoogleIcon from '@/components/icons/google';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { UserPopulated } from '@/schemas/user/populated.schema';

import RowMenu from './RowMenu';


export type UserColumn = UserPopulated;

export const COLUMN_NAMES = {
	username: 'username',
	email: 'email',
	provider_data: 'provider',
	is_disabled: 'status',
	has_email_verified: 'email verified',
	role: 'role',
	created_at: 'created at',
};

const getProviderIcon = (provider: AuthenticationProvider) => {
	switch (provider) {
		case AuthenticationProvider.EMAIL:
			return <Mail size="16" />;
		case AuthenticationProvider.GOOGLE:
			return <GoogleIcon size="16" />;
		case AuthenticationProvider.APPLE:
			return <AppleIcon size="16" />;
		default:
			return <KeyRound size="16" />;
	}
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
		cell: ({ row }) => (
			<span className="flex gap-2 items-center">
				<Avatar className="w-8 h-8">
					<AvatarImage
						alt="Profile"
						src={ row.original.photo?.url || undefined }
					/>
					<AvatarFallback><User size="16" /></AvatarFallback>
				</Avatar>
				{ row.original.username ? row.original.username : <span className="italic text-slate-500">No username</span> }
			</span>
		),
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
		id: 'provider_data',
		accessorKey: 'provider_data',
		header: ({ column }) => {
			const handleSort = () => column.toggleSorting(column.getIsSorted() === 'asc');
			const sortState = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={ handleSort }
				>
					Provider
					{ sortState === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : sortState === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-slate-500" /> }
				</Button>
			);
		},
		meta: {
			cell: { align: 'center' },
			header: { align: 'center' }, 
		},
		cell: ({ row }) => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<span className="flex gap-2 items-center">
							{ getProviderIcon(row.original.provider_data) }
						</span>
					</TooltipTrigger>
					<TooltipContent className="capitalize">
						{ row.original.provider_data }
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
		cell: ({ row }) => {
			row.original.created_at ? <span>{ new Date(row.original.created_at).toLocaleDateString('fr') } { new Date(row.original.created_at).toLocaleTimeString('fr') }</span> : null; 
		},
	},
	{
		id: 'actions',
    	enableHiding: false,
		cell: ({ row }) => <RowMenu rowData={ row.original } />,
	},
];
