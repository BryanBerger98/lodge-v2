/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, User, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { ZodError, boolean, object, string, z } from 'zod';

import InputPhone from '@/components/forms/inputs/InputPhone';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/Button/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import useUsers from '@/context/users/useUsers';
import { createUser, updateUser } from '@/services/users.service';
import { IUser, UserRole } from '@/types/user.type';
import { ApiError, getErrorMessage } from '@/utils/error';

type EditUserFormProps = {
	user?: IUser;
	csrfToken: string;
};

const EditUserForm = ({ user, csrfToken }: EditUserFormProps) => {

	const { toast } = useToast();

	const { updateUsers } = useUsers();

	const [ fileToUpload, setFileToUpload ] = useState<File | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();
	const pathname = usePathname();

	const editUserFormSchema = object({
		username: string().min(1, 'Required.'),
		email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
		phone_number: string(),
		role: z.enum([ 'user', 'admin', 'owner' ]),
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

	const handleSubmitEditUserForm = async (values: z.infer<typeof editUserFormSchema>) => {
		if (user?.role === 'owner') {
			return;
		}
		if (values.role === 'owner') {
			return toast({
				title: 'Error',
				description: 'The "Owner" role is not assignable to a user.',
				variant: 'destructive',
			});
		}
		try {
			setIsLoading(true);
			if (pathname.includes('/users/edit') && user) {
				const updatedUser = await updateUser({
					...values,
					role: values.role,
					id: user.id,
					avatar: fileToUpload,
				}, csrfToken);
				updateUsers(updatedUser);
				return;
			}
			const createdUser = await createUser({
				...values,
				role: values.role,
				avatar: fileToUpload, 
			}, csrfToken);
			router.replace(`/users/edit/${ createdUser.id }`);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof z.infer<typeof editUserFormSchema>;
						const [ inputName ] = issue.path;
						if (inputName) {
							form.setError(inputName.toString() as IssueName, { message: issue.message });
						}
					});
				}
			}
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
		<Form { ...form }>
			<form
				className="flex flex-col gap-8"
				onSubmit={ form.handleSubmit(handleSubmitEditUserForm) }
			>
				<Card>
					<CardHeader className="w-full lg:w-1/3">
						<CardTitle>User informations</CardTitle>
						<CardDescription>
							Manage user informations.
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
							{
								user?.role !== 'owner' ?
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="picture">Picture</Label>
										<Input
											accept="image/png, image/gif, image/jpeg"
											id="picture"
											type="file"
											onChange={ handleUpdateFile }
										/>
									</div>
									: null
							}
						</div>
						<FormField
							control={ form.control }
							name="username"
							render={ ({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											disabled={ user?.role === 'owner' }
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
											disabled={ user?.role === 'owner' }
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
												disabled={ user?.role === 'owner' }
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
					<CardHeader className="w-full lg:w-1/3">
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
											disabled={ user?.role === 'owner' }
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
							render={ ({ field }) => {

								const handleChange = (value: string) => {
									field.onChange(value as UserRole);
								};

								return (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											defaultValue={ field.value }
											onValueChange={ handleChange }
										>
											<FormControl>
												<SelectTrigger disabled={ user?.role === 'owner' }>
													<SelectValue placeholder="Select a verified email to display" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="user">User</SelectItem>
												<SelectItem value="admin">Admin</SelectItem>
												<SelectItem
													value="owner"
													disabled
												>Owner
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								);
							} }
						/>
					</CardContent>
				</Card>
				{
					user?.role !== 'owner' ?
						<div className="flex justify-end gap-4">
							{
								!isLoading ?
									<BackButton>
										<X /> Cancel
									</BackButton>
									: null
							}
							<Button
								className="gap-2"
								disabled={ isLoading }
								type="submit"
							>
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
								Save
							</Button>
						</div>
						: null
				}
			</form>
		</Form>
	);
};

export default EditUserForm;