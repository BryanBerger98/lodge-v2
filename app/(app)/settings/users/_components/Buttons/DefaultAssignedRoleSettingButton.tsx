import { Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { UnregisteredSettingStringPopulated } from '@/schemas/setting';
import { ApiError } from '@/utils/api/error';

type DefaultAssignedRoleSettingButtonProps = {
	initialValue: UnregisteredSettingStringPopulated | null;
}

const DefaultAssignedRoleSettingButton = ({ initialValue }: DefaultAssignedRoleSettingButtonProps) => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);
	const [ setting, setSetting ] = useState<UnregisteredSettingStringPopulated | null>(initialValue);

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const handleOpenDialog = () => setIsDialogOpen(true);
	const handleCancel = () => {
		setIsDialogOpen(false);
		setSetting(initialValue);
	};

	const handleSubmit = () => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			// const updatedUser = await updateAccount({ gender }, { csrfToken });
			// await updateCurrentUser(updatedUser);
			// form.reset({ gender: updatedUser.gender || Gender.UNSPECIFIED });
			setIsDialogOpen(false);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			triggerErrorToast(apiError);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (value: string) => {
		setSetting(setting ? {
			...setting,
			value,
		} : null);
	};

	const handleDialogOpenChange = (open: boolean) => {
		if (!isLoading) {
			setIsDialogOpen(open);
		}
	};

	return (
		<Dialog
			open={ isDialogOpen }
			onOpenChange={ handleDialogOpenChange }
		>
			<DialogTrigger asChild>
				<ButtonItem
					className="capitalize"
					value="User"
					onClick={ handleOpenDialog }
				>
					Default assigned role
				</ButtonItem>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Default assigned role</DialogTitle>
					<DialogDescription>Users who sign up will be assigned this role by default.</DialogDescription>
				</DialogHeader>
				<div className="space-y-2 py-4">
					<Label>Role</Label>
					<Select
						defaultValue={ setting?.value }
						onValueChange={ handleChange }
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ Role.USER }>User</SelectItem>
							<SelectItem value={ Role.ADMIN }>Admin</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<DialogFooter>
					<Button
						disabled={ isLoading }
						type="button"
						variant="outline"
						onClick={ handleCancel }
					>
						<X className="w-4 h-4" />
						Cancel
					</Button>
					<Button
						disabled={ isLoading }
						type="button"
					>
						{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="w-4 h-4" /> }
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DefaultAssignedRoleSettingButton;