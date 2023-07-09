'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, User, X } from 'lucide-react';
import Link from 'next/link';
import { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { boolean, object, string, z } from 'zod';

import InputPhone from '@/components/forms/inputs/InputPhone';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { IUser } from '@/types/user.type';

type EditUserFormProps = {
	user?: IUser;
};

const EditUserForm = ({ user }: EditUserFormProps) => {

	const { toast } = useToast();

	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const editUserFormSchema = object({
		username: string().min(1, 'Required.'),
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		phone_number: string(),
		role: z.enum([ 'user', 'admin' ]),
		is_disabled: boolean(),
	});

	const form = useForm<z.infer<typeof editUserFormSchema>>({
		resolver: zodResolver(editUserFormSchema),
		defaultValues: {
			username: user?.username || '',
			email: user?.email || '',
			phone_number: user?.phone_number || '',
			role: user?.role || 'user',
			is_disabled: user?.is_disabled || false,
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
		<Form { ...form }>
			<Card>
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
			</Card>
			<Card>
				<CardHeader className="w-1/3">
					<CardTitle>User access rights</CardTitle>
					<CardDescription>
						Manage user role and permissions.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FormField
						control={ form.control }
						name="is_disabled"
						render={ ({ field }) => (
							<FormItem className="flex items-center gap-4 mb-4">
								<FormControl>
									<Switch
										checked={ field.value }
										onCheckedChange={ field.onChange }
									/>
								</FormControl>
								<FormLabel className="!m-0">
									Disable user account
								</FormLabel>
							</FormItem>
						) }
					/>
					<FormField
						control={ form.control }
						name="role"
						render={ ({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<Select
									defaultValue={ field.value }
									onValueChange={ field.onChange }
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a verified email to display" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						) }
					/>
				</CardContent>
			</Card>
			<div className="flex justify-end gap-4">
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
			</div>
		</Form>
	);
};

export default EditUserForm;