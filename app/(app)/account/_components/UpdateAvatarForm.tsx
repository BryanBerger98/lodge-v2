/* eslint-disable react/jsx-handler-names */
'use client';

import { Loader2, Save, User, X } from 'lucide-react';
import { ChangeEventHandler, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import { updateUserAvatar } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';
import { optimizeImage } from '@/utils/file.util';

type UpdateAvatarFormProps = {
	csrfToken: string;
};

const UpdateAvatarForm = ({ csrfToken }: UpdateAvatarFormProps) => {

	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	
	const { currentUser, updateCurrentUser } = useAuth();
	
	const { toast } = useToast();

	const handleUpdateFile: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { files } = event.target;
		if (files) {
			const file = files.item(0);
			setFileToUpload(file);
		}
	};

	const handleCancelUpdateFile = () => setFileToUpload(null);

	const handleUploadFile = async () => {
		if (fileToUpload) {
			setIsLoading(true);
			try {
				const optimizedFile = await optimizeImage(fileToUpload);
				const updatedUser = await updateUserAvatar(optimizedFile, { csrfToken });
				if (updatedUser) {
					await updateCurrentUser(updatedUser);
				}
			} catch (error) {
				console.error(error);
				toast({
					title: 'Error',
					description: getErrorMessage(error as ApiError<unknown>),
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Card className="w-full lg:flex">
			<CardHeader className="lg:w-1/3">
				<CardTitle>Profile picture</CardTitle>
				<CardDescription>
					Update your profile picture.
				</CardDescription>
			</CardHeader>
			<div className="lg:w-2/3">
				<CardContent className="lg:pt-6 flex flex-col items-center gap-4">
					<Avatar className="w-32 h-32">
						<AvatarImage
							alt="Profile"
							src={ (fileToUpload && URL.createObjectURL(fileToUpload)) || currentUser?.photo?.url || undefined }
						/>
						<AvatarFallback><User /></AvatarFallback>
					</Avatar>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="picture">Picture</Label>
						<Input
							accept="image/png, image/gif, image/jpeg"
							id="picture"
							type="file"
							onChange={ handleUpdateFile }
						/>
					</div>
				</CardContent>
				<CardFooter className="gap-4 justify-end">
					{
						fileToUpload ?
							<Button
								className="gap-2"
								type="button"
								variant="outline"
								onClick={ handleCancelUpdateFile }
							>
								<X />
								Cancel
							</Button>: null
					}
					<Button
						className="gap-2"
						disabled={ isLoading }
						type="button"
						onClick={ handleUploadFile }
					>
						{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
						Save
					</Button>
				</CardFooter>
			</div>
		</Card>
	);
};

export default UpdateAvatarForm;