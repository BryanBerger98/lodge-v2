import { ColumnDef } from '@tanstack/react-table';
import { BadgeCheck, BadgeX } from 'lucide-react';

import ColumnHeadSort from '@/components/ui/DataTable/Columns/ColumnHeadSort';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserPopulated } from '@/schemas/user/populated.schema';

const UserEmailColumn: ColumnDef<UserPopulated> = 	{
	id: 'email',
	accessorKey: 'email',
	header: ({ column }) => <ColumnHeadSort column={ column }>Email</ColumnHeadSort>,
	cell: ({ row }) => (
		<TooltipProvider delayDuration={ 100 }>
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
};

export default UserEmailColumn;