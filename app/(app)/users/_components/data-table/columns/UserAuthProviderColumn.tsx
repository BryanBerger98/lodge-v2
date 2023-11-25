import { ColumnDef } from '@tanstack/react-table';
import { KeyRound, Mail } from 'lucide-react';

import AppleIcon from '@/components/icons/apple';
import GoogleIcon from '@/components/icons/google';
import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { UserPopulated } from '@/schemas/user/populated.schema';

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

const UserAuthProviderColumn: ColumnDef<UserPopulated> = {
	id: 'provider_data',
	accessorKey: 'provider_data',
	header: ({ column }) => <ColumnHeadSort column={ column }>Provider</ColumnHeadSort>,
	meta: {
		cell: { align: 'center' },
		header: { align: 'center' }, 
	},
	cell: ({ row }) => (
		<TooltipProvider delayDuration={ 100 }>
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
};

export default UserAuthProviderColumn;