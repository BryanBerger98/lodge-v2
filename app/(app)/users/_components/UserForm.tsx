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
import useErrorToast from '@/hooks/error/useErrorToast';
import { createUser } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

import UserAccessRightsFormBlock, { UserAccessRightsFormBlockSchema } from './form-blocks/UserAccessRightsFormBlock';
import UserPersonalInformationsFormBlock, { UserPersonalInformationsFormBlockSchema } from './form-blocks/UserPersonalInformationsFormBlock';


const UserFormSchema = z.object({}).merge(UserPersonalInformationsFormBlockSchema).merge(UserAccessRightsFormBlockSchema).merge(ProfilePhotoFieldSchema);

type UserFormValues = z.infer<typeof UserFormSchema>;

const UserForm = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	
	const router = useRouter();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<UserFormValues>({
		resolver: zodResolver(UserFormSchema),
		mode: 'onSubmit',
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
			await createUser(values, { csrfToken });
			router.push('/users');
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