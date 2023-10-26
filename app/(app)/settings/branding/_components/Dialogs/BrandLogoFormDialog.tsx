import { ImageIcon, Loader2, Save, Trash, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEventHandler, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import { SettingName } from '@/schemas/setting';
import { deleteImageSetting, updateImageSetting } from '@/services/settings.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type BrandLogoFormDialogProps = {
	isOpen: boolean;
};

const BrandLogoFormDialog = ({ isOpen }: BrandLogoFormDialogProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isDeletionLoading, setIsDeletionLoading ] = useState<boolean>(false);
	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const { csrfToken } = useCsrf();
	const { getSetting, loading, refetchSettings } = useSettings();

	const brandLogoSetting = getSetting(SettingName.BRAND_LOGO);

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
					name: SettingName.BRAND_LOGO,
					value: fileToUpload,
				}, { csrfToken });
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

	const handleDeleteLogo = async () => {
		try {
			if (!csrfToken) return;
			setIsDeletionLoading(true);
			await deleteImageSetting(SettingName.BRAND_LOGO, { csrfToken });
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
			setIsDeletionLoading(false);
		}
	};

	const handleCancel = () => {
		setFileToUpload(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
			fileInputRef.current.files = null;
		}
	};

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ handleClose }
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Brand logo</DialogTitle>
					<DialogDescription>Set up a logo for your app.</DialogDescription>
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
							ref={ fileInputRef }
							type="file"
							hidden
							onChange={ handleUpdateFile }
						/>
					</label>
				</div>
				<DialogFooter>
					{
						!fileToUpload && brandLogoSetting?.value?.url ?
							<Button
								className="gap-2"
								disabled={ isDeletionLoading }
								type="button"
								variant="destructive"
								onClick={ handleDeleteLogo }
							>
								{ 
									isDeletionLoading ?
										<Loader2
											className="animate-spin"
											size="16"
										/>
										: <Trash size="16"/>
								}
								Delete logo
							</Button>
							: null
					}
					{
						fileToUpload && !isLoading ?
							<Button
								className="gap-2"
								disabled={ isLoading }
								type="button"
								variant="outline"
								onClick={ handleCancel }
							>
								<X size="16"/>
								Cancel
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