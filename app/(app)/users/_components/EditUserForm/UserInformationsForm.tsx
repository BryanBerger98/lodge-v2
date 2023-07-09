'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, User, X } from 'lucide-react';
import Link from 'next/link';
import { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { object, string, z } from 'zod';

import InputPhone from '@/components/forms/inputs/InputPhone';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { IUser } from '@/types/user.type';

type UserInformationsFormProps = {
	user?: IUser;
};

const UserInformationsForm = ({ user }: UserInformationsFormProps) => {

	const { toast } = useToast();

	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const userInformationsFormSchema = object({
		username: string().min(1, 'Required.'),
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		phone_number: string(),
	});

	const form = useForm<z.infer<typeof userInformationsFormSchema>>({
		resolver: zodResolver(userInformationsFormSchema),
		defaultValues: {
			username: user?.username || '',
			email: user?.email || '',
			phone_number: user?.phone_number || '',
		},
		mode: 'onTouched',
	});

	const handleUpdateFile: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { files } = event.target;
		if (files) {
			const file = files.item(0);
			setFileToUpload(file);
		}
	};

	return (
		<Card>
			<Form { ...form }>
				<CardHeader className="w-1/3">
					<CardTitle>User informations</CardTitle>
					<CardDescription>
						Add user informations.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="pt-6 flex flex-col items-center gap-4 mb-4">
						<Avatar className="w-32 h-32">
							<AvatarImage
								alt="Profile"
								src={ (fileToUpload && URL.createObjectURL(fileToUpload)) || user?.photo_url || undefined }
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
					</div>
					<FormField
						control={ form.control }
						name="username"
						render={ ({ field }) => (
							<FormItem className="mb-4">
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										placeholder="John Doe"
										type="text"
										{ ...field }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
					<FormField
						control={ form.control }
						name="email"
						render={ ({ field }) => (
							<FormItem className="mb-4">
								<FormLabel>Email address</FormLabel>
								<FormControl>
									<Input
										placeholder="john@doe.com"
										{ ...field }
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						) }
					/>
					<FormField
						control={ form.control }
						name="phone_number"
						render={ ({ field }) => {

							return (
								<FormItem>
									<FormLabel>Phone number</FormLabel>
									<FormControl>
										<InputPhone
											defaultCountry="FR"
											{ ...field }
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						} }
						rules={ { validate: (value) => isValidPhoneNumber(value) || 'Invalid phone number.' } }
					/>
				</CardContent>
				<CardFooter className="justify-end gap-4">
					<Button
						className="gap-2 items-center"
						variant="outline"
						asChild
					>
						<Link href="/users">
							<X /> Cancel
						</Link>
					</Button>
					<Button className="gap-2 items-center">
						<Save /> Save
					</Button>
				</CardFooter>
			</Form>
		</Card>
	);
};

export default UserInformationsForm;