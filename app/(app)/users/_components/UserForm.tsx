'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ProfilePhotoField, { ProfilePhotoFieldSchema } from '@/app/_components/form/fields/ProfilePhotoField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import useUser from '@/context/users/user/useUser';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { Gender } from '@/schemas/user/gender.schema';
import { ApiError } from '@/utils/api/error';

import UserAccessRightsFormBlock, { UserAccessRightsFormBlockSchema } from './form-blocks/UserAccessRightsFormBlock';
import UserPersonalInformationsFormBlock, { UserPersonalInformationsFormBlockSchema } from './form-blocks/UserPersonalInformationsFormBlock';

const UserFormSchema = z.object({}).merge(UserPersonalInformationsFormBlockSchema).merge(UserAccessRightsFormBlockSchema).merge(ProfilePhotoFieldSchema);

type UserFormValues = z.infer<typeof UserFormSchema>;

const UserForm = () => {

	const { user, updateUser, createUser, isLoading, isMutating } = useUser();
	
	const router = useRouter();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<UserFormValues>({
		resolver: zodResolver(UserFormSchema),
		mode: 'onSubmit',
		defaultValues: {
			email: user?.email || '',
			first_name: user?.first_name || '',
			last_name: user?.last_name || '',
			phone_number: user?.phone_number || '',
			role: user?.role || Role.USER,
			is_disabled: user?.is_disabled || false,
			username: user?.username || '',
			birth_date: user?.birth_date || undefined,
			avatar: user?.photo?.url,
			gender: user?.gender || Gender.UNSPECIFIED,
		},
	});

	useEffect(() => {
		if (user) {
			form.setValue('email', user.email);
			form.setValue('first_name', user.first_name || '');
			form.setValue('last_name', user.last_name || '');
			form.setValue('phone_number', user.phone_number);
			form.setValue('role', user.role);
			form.setValue('is_disabled', user.is_disabled);
			form.setValue('username', user.username || '');
			form.setValue('birth_date', user.birth_date || undefined);
			form.setValue('avatar', user.photo?.url);
			form.setValue('gender', user.gender || Gender.UNSPECIFIED);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ user ]);

	const handleSubmit = async (values: UserFormValues) => {
		try {
			if (user) {
				await updateUser(values);
			} else {
				await createUser(values);
				router.push('/users');
			}
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>, form);
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
					<Button disabled={ isMutating || isLoading }>
						{ isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" /> }
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default UserForm;