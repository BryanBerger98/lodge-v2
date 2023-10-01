import { Loader2, Save } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import { updateSettings } from '@/services/settings.service';
import { ApiError, getErrorMessage } from '@/utils/error';
import { SETTING_NAMES } from '@/utils/settings';

type BrandLogoFormDialogProps = {
	isOpen: boolean;
};

const BrandLogoFormDialog = ({ isOpen }: BrandLogoFormDialogProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { csrfToken } = useCsrf();
	const { getSetting, loading, refetchSettings } = useSettings();

	const brandLogoSetting = getSetting(SETTING_NAMES.BRAND_LOGO_SETTING);

	const { toast } = useToast();

	const handleClose = () => {
		const params = new URLSearchParams(searchParams);
		params.delete('edit_setting');
		router.push(`${ pathname }?${ params.toString() }`);
	};

	const handleSubmit = async () => {
		try {
			if (!csrfToken) return;
			setIsLoading(true);
			await updateSettings([
				{
					name: SETTING_NAMES.BRAND_NAME_SETTING,
					value: '',
					data_type: 'string',
				},
			], csrfToken);
			refetchSettings();
			handleClose();
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			toast({
				title: 'Error',
				description: getErrorMessage(apiError),
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ handleClose }
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Brand name</DialogTitle>
					<DialogDescription>Set up a name for your app.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
				</div>
				<DialogFooter>
					<Button
						className="gap-2"
						disabled={ isLoading }
						type="submit"
					>
						{ 
							isLoading ?
								<Loader2
									className="animate-spin"
									size="16"
								/>
								: <Save size="16"/>
						}
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default BrandLogoFormDialog;