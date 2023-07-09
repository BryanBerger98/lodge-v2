import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { UserColumn } from './columns';

type MenuProps = {
	rowData: UserColumn;
}

const Menu = ({ rowData }: MenuProps) => {

	const handleClick = () => {
		navigator.clipboard.writeText(rowData.id.toString());
	};

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
					onClick={ handleClick }
				>
					Copy payment ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>View customer</DropdownMenuItem>
				<DropdownMenuItem>View payment details</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Menu;