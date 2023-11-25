import { Check, Loader2, User } from 'lucide-react';
import { ReactNode, useState } from 'react';

import InputSearch from '@/components/forms/Input/InputSearch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Role } from '@/schemas/role.schema';
import { UserPopulated } from '@/schemas/user/populated.schema';
import { fetchUsers } from '@/services/users.service';
import { cn } from '@/utils/ui.util';

type SearchSelectUsersModalProps = {
	isOpen: boolean;
	onOpenChange: (event: { openState: boolean, selected: UserPopulated[] }) => void;
	alreadySelected?: UserPopulated[];
	roles?: Role[];
	title?: ReactNode;
	description?: ReactNode;
	noResultsText?: ReactNode;
	searchPlaceholder?: string;
};

const SearchSelectUsersModal = ({ isOpen, onOpenChange, alreadySelected, roles = [ Role.ADMIN, Role.USER, Role.OWNER ], title = 'Search users', description = 'Search and select one or multiple users.', noResultsText = 'No user found.', searchPlaceholder = 'Search...' }: SearchSelectUsersModalProps) => {

	const [ selected, setSelected ] = useState<UserPopulated[]>([]);
	const [ options, setOptions ] = useState<UserPopulated[]>([]);
	const [ isLoading, setIsLoading ] = useState(false);

	const handleOpenChange = (openState: boolean) => {
		onOpenChange({
			openState,
			selected: [],
		});
	};

	const handleSearch = async (value: string) => {
		try {
			setIsLoading(true);
			const { users } = await fetchUsers({
				search: value.trim(),
				roles,
				limit: 50,
			});
			setOptions(users);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelect = (option: UserPopulated) => () => {
		if (selected.find(el => el.id.toString() === option.id.toString())) {
			setSelected((prevSelected) => prevSelected.filter((prevOption) => prevOption.id !== option.id));
		} else {
			setSelected((prevSelected) => [ ...prevSelected, option ]);
		}
	};

	const handleValidate = () => {
		onOpenChange({
			openState: false,
			selected,
		});
		setSelected([]);
		setOptions([]);
	};

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ handleOpenChange }
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{ title }</DialogTitle>
					<DialogDescription>
						{ description }
					</DialogDescription>
				</DialogHeader>
				<InputSearch
					placeholder={ searchPlaceholder }
					onSearch={ handleSearch }
				/>
				{
					options.length === 0 && !isLoading && (
						<p className="text-center text-muted-foreground text-sm py-4">{ noResultsText }</p>
					)
				}
				{
					isLoading ? 
						<div className="flex flex-col items-center justify-center py-4">
							<Loader2
								className="animate-spin text-muted-foreground"
								size="32"
							/>
						</div>
						: null
				}
				{
					options.length > 0 && !isLoading && (
						<div
							className="flex flex-col max-h-[300px] overflow-x-hidden overflow-y-auto"
							role="menu"
						>
							{ options.map((option) => (
								<Button
									key={ option.id.toString() }
									className="justify-between px-2 py-2 text-sm h-fit"
									disabled={ alreadySelected?.find(el => el.id.toString() === option.id.toString()) !== undefined }
									role="menuitem"
									variant="ghost"
									onClick={ handleSelect(option) }
								>
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage
												alt={ option.first_name && option.last_name ? `${ option.first_name } ${ option.last_name }` : option.username ? option.username : option.email }
												src={ option.photo?.url || undefined }
											/>
											<AvatarFallback><User size="16" /></AvatarFallback>
										</Avatar>
										<div className="flex flex-col justify-start items-start">
											{ option.first_name && option.last_name ? <p className="text-sm font-medium">{ option.first_name } { option.last_name }</p> : option.username ? <p className="text-sm font-medium">{ option.username }</p> : null }
											<p
												className={ cn(
													'text-sm',
													(option.first_name && option.last_name) || option.username ? 'text-muted-foreground' : 'font-medium'
												) }
											>{ option.email }
											</p>
										</div>
									</div>
									<Check
										className={ cn(
											'mr-2 h-4 w-4',
											selected.find(el => el.id.toString() === option.id.toString()) ? 'opacity-100' : 'opacity-0'
										) }
									/>
								</Button>
							)) }
						</div>
					)
				}
				<DialogFooter className="sm:flex-row sm:space-x-2 flex items-center border-t pt-4 sm:justify-between">
					<div className="flex -space-x-2 overflow-hidden">
						{
							selected.map((user) => (
								<TooltipProvider
									key={ user.id.toString() }
									delayDuration={ 100 }
								>
									<Tooltip>
										<TooltipTrigger>
											<Avatar className="w-8 h-8 border-2 border-background">
												<AvatarImage
													alt={ user.first_name && user.last_name ? `${ user.first_name } ${ user.last_name }` : user.username ? user.username : user.email }
													src={ user.photo?.url || undefined }
												/>
												<AvatarFallback><User size="16" /></AvatarFallback>
											</Avatar>
										</TooltipTrigger>
										<TooltipContent>
											{ user.first_name && user.last_name ? `${ user.first_name } ${ user.last_name } <${ user.email }>` : user.username ? `${ user.username } <${ user.email }>` : user.email }
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							))
						}
					</div>
					<Button
						className="gap-2 items-center"
						disabled={ selected.length === 0 }
						type="button"
						onClick={ handleValidate }
					>
						<Check size="16" />
						Valider
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SearchSelectUsersModal;