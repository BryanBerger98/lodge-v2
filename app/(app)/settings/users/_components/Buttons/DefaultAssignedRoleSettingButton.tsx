import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { UnregisteredSettingStringPopulated } from '@/schemas/setting';
import { updateSettings } from '@/services/settings.service';
import { ApiError } from '@/utils/api/error';

type DefaultAssignedRoleSettingButtonProps = {
	initialValue: UnregisteredSettingStringPopulated | null;
}

const DefaultAssignedRoleSettingButton = ({ initialValue }: DefaultAssignedRoleSettingButtonProps) => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);
	const [ setting, setSetting ] = useState<UnregisteredSettingStringPopulated | null>(initialValue);

	const { refetchSettings } = useSettings();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();
	const { toast } = useToast();

	useEffect(() => {
		if (initialValue) {
			setSetting(initialValue);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ initialValue ]);

	const handleOpenDialog = () => setIsDialogOpen(true);
	const handleCancel = () => {
		setIsDialogOpen(false);
		setSetting(initialValue);
	};

	const handleSubmit = async () => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		if (!setting) {
			return;
		}
		try {
			setIsLoading(true);
			await updateSettings([
				{
					name: setting.name,
					data_type: setting.data_type,
					value: setting.value,
				},
			], { csrfToken });
			await refetchSettings();
			setIsDialogOpen(false);
			toast({
				title: 'Success',
				description: 'Settings updated.',
			});
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
					value={ <span className="capitalize">{ initialValue?.value }</span> }
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
						onClick={ handleSubmit }
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