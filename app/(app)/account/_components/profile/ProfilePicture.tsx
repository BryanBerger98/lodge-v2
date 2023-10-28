'use client';

import { Loader2, Save, User, X } from 'lucide-react';
import { ChangeEventHandler, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Paragraph } from '@/components/ui/Typography/text';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { updateUserAvatar } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';
import { optimizeImage } from '@/utils/file.util';

const ProfilePicture = () => {

	const inputRef = useRef<HTMLInputElement>(null);

	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const handleUpdateFile: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { files } = event.target;
		if (files) {
			const file = files.item(0);
			setFileToUpload(file);
			setIsDialogOpen(true);
		}
	};

	const handleCancelUpdateFile = () => {
		setFileToUpload(null);
		setIsDialogOpen(false);
		if (inputRef.current) {
			inputRef.current.value = '';
			inputRef.current.files = null;
		}
	};

	const handleUploadFile = async () => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		if (fileToUpload) {
			setIsLoading(true);
			try {
				const optimizedFile = await optimizeImage(fileToUpload);
				const updatedUser = await updateUserAvatar(optimizedFile, { csrfToken });
				if (updatedUser) {
					await updateCurrentUser(updatedUser);
				}
				handleCancelUpdateFile();
			} catch (error) {
				triggerErrorToast(error as ApiError<unknown>);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleOpenDialogChange = (openState: boolean) => {
		if (!openState) {
			setFileToUpload(null);
			if (inputRef.current) {
				inputRef.current.value = '';
				inputRef.current.files = null;
			}
		}
		setIsDialogOpen(openState);
	};

	return (
		<>
			<label className="w-28 h-28 rounded-full relative overflow-hidden group hover:cursor-pointer">
				<Avatar className="w-28 h-28">
					<AvatarImage
						alt="Profile"
						src={ currentUser?.photo?.url }
					/>
					<AvatarFallback><User /></AvatarFallback>
				</Avatar>
				<div className="absolute left-0 right-0 bottom-0 bg-primary/50 opacity-0 py-1 text-primary-foreground group-hover:opacity-100">
					<Paragraph
						className="uppercase text-center"
						variant="small"
					>Edit
					</Paragraph>
				</div>
				<input
					accept="image/png, image/gif, image/jpeg, image/webp"
					ref={ inputRef }
					type="file"
					hidden
					onChange={ handleUpdateFile }
				/>
			</label>
			<Dialog
				open={ isDialogOpen }
				onOpenChange={ handleOpenDialogChange }
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Profile picture</DialogTitle>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<Paragraph>Set this image as your profile picture ?</Paragraph>
						<div className="flex justify-center">
							<Avatar className="w-32 h-32">
								<AvatarImage
									alt="Profile"
									src={ (fileToUpload && URL.createObjectURL(fileToUpload)) || undefined }
								/>
								<AvatarFallback><User /></AvatarFallback>
							</Avatar>
						</div>
					</div>
					<DialogFooter>
						<Button
							className="gap-2"
							disabled={ isLoading }
							type="button"
							variant="outline"
							onClick={ handleCancelUpdateFile }
						>
							<X size="16" />
							Cancel
						</Button>
						<Button
							className="gap-2"
							disabled={ isLoading }
							type="button"
							onClick={ handleUploadFile }
						>
							{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size="16" /> }
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProfilePicture;