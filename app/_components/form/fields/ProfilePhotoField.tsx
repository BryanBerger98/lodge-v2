import { User } from 'lucide-react';
import { ChangeEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Paragraph } from '@/components/ui/Typography/text';

export const ProfilePhotoFieldSchema = z.object({ avatar: z.instanceof(File).or(z.string().url()).optional() });

export type ProfilePhotoFieldValues = z.infer<typeof ProfilePhotoFieldSchema>;

const ProfilePhotoField = () => {

	const form = useFormContext<ProfilePhotoFieldValues>();

	return (
		<FormField
			control={ form.control }
			name="avatar"
			render={ ({ field }) => {
				const handleUpdateFile: ChangeEventHandler<HTMLInputElement> = (event) => {
					const { files } = event.target;
					if (files) {
						const file = files.item(0);
						field.onChange(file);
					}
				};
				return (
					<FormItem className="w-28 h-28 rounded-full relative overflow-hidden group">
						<FormLabel className="w-28 h-28 hover:cursor-pointer">
							<Avatar className="w-28 h-28">
								<AvatarImage
									alt="Profile"
									src={ typeof field.value === 'string' ? field.value : field.value ? URL.createObjectURL(field.value) : undefined }
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
						</FormLabel>
						<FormControl className="hidden">
							<Input
								accept="image/png, image/gif, image/jpeg, image/webp"
								type="file"
								hidden
								onChange={ handleUpdateFile }
							/>
						</FormControl>
					</FormItem>
				);
			} }
		/>
	);
};

export default ProfilePhotoField;