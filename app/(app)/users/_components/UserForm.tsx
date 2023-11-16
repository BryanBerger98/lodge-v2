'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ProfilePhotoField, { ProfilePhotoFieldSchema } from '@/app/_components/form/fields/ProfilePhotoField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import useCsrf from '@/context/csrf/useCsrf';
import useUser from '@/context/users/user/useUser';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { createUser, updateUser } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

import UserAccessRightsFormBlock, { UserAccessRightsFormBlockSchema } from './form-blocks/UserAccessRightsFormBlock';
import UserPersonalInformationsFormBlock, { UserPersonalInformationsFormBlockSchema } from './form-blocks/UserPersonalInformationsFormBlock';


const UserFormSchema = z.object({}).merge(UserPersonalInformationsFormBlockSchema).merge(UserAccessRightsFormBlockSchema).merge(ProfilePhotoFieldSchema);

type UserFormValues = z.infer<typeof UserFormSchema>;

const UserForm = () => {

	const [ isLoading, setIsLoading ] = useState(false);

	const { user, setUser } = useUser();
	
	const router = useRouter();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<UserFormValues>({
		resolver: zodResolver(UserFormSchema),
		mode: 'onSubmit',
		defaultValues: {
			email: user?.email,
			first_name: user?.first_name || undefined,
			last_name: user?.last_name || undefined,
			phone_number: user?.phone_number,
			role: user?.role || Role.USER,
			is_disabled: user?.is_disabled || false,
			username: user?.username || undefined,
			birth_date: user?.birth_date || undefined,
			avatar: user?.photo?.url,
			gender: user?.gender,
		},
	});

	const handleSubmit = async (values: UserFormValues) => {
		try {
			if (!csrfToken) {
				triggerErrorToast({
					title: 'Error',
					description: 'Invalid CSRF token.',
				});
				return;
			}
			setIsLoading(true);
			if (user) {
				const updatedUser = await updateUser({
					id: user.id,
					...values,
				}, { csrfToken });
				setUser(updatedUser);
			} else {
				await createUser(values, { csrfToken });
				router.push('/users');
			}
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>, form);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form { ...form }>
			<form
				className="space-y-8"
				onSubmit={ form.handleSubmit(handleSubmit) }
			>
				<Card>
					<CardHeader>
						<CardTitle>Personal informations</CardTitle>
						<CardDescription>Manage user personal informations.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex justify-center">
							<ProfilePhotoField />
						</div>
						<UserPersonalInformationsFormBlock />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Access rights</CardTitle>
						<CardDescription>Manage user role and permissions.</CardDescription>
					</CardHeader>
					<CardContent>
						<UserAccessRightsFormBlock />
					</CardContent>
				</Card>
				<div className="flex justify-end">
					<Button>
						{ isLoading ? <Loader2 className="w4 h-4 animate-spin" /> : <Save className="w4 h-4" /> }
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default UserForm;