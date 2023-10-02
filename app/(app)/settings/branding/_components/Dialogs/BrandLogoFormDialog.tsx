import { ImageIcon, Loader2, Save, Trash, Upload } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import { updateImageSetting } from '@/services/settings.service';
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
			await updateImageSetting(
				{
					name: SETTING_NAMES.BRAND_LOGO_SETTING,
					value: fileToUpload,
				}, csrfToken);
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

	const handleUpdateFile: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { files } = event.target;
		if (files) {
			const file = files.item(0);
			setFileToUpload(file);
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
					<label className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4 w-full flex min-h-[178px] relative group justify-center items-center text-slate-100">
						{
							fileToUpload || (brandLogoSetting && brandLogoSetting.value && brandLogoSetting.value.url) ? (
								<Image
									alt="Brand logo"
									className="rounded-lg object-contain p-4"
									src={ fileToUpload ? URL.createObjectURL(fileToUpload) : brandLogoSetting?.value?.url || '' }
									fill
								/>
							) : <ImageIcon size="128" />
						}
						<div className="transition-opacity duration-100 ease-linear opacity-0 group-hover:opacity-100 bg-slate-900/30 flex justify-center flex-col gap-4 items-center absolute inset-0 text-white cursor-pointer rounded-lg">
							<Upload size="32" />
							<p className="text-lg font-medium">Upload a picture</p>
						</div>
						<input
							accept="image/png, image/gif, image/jpeg, image/webp"
							disabled={ loading === 'pending' }
							type="file"
							hidden
							onChange={ handleUpdateFile }
						/>
					</label>
				</div>
				<DialogFooter>
					{
						brandLogoSetting && brandLogoSetting.value && brandLogoSetting.value.url ?
							<Button
								className="gap-2"
								type="button"
								variant="destructive"
							>
								<Trash size="16" />
								Delete logo
							</Button>
							: null
					}
					<Button
						className="gap-2"
						disabled={ isLoading || !fileToUpload }
						type="button"
						onClick={ handleSubmit }
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