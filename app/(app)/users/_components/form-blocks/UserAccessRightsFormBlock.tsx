import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useUser from '@/context/users/user/useUser';
import { Role } from '@/schemas/role.schema';

export const UserAccessRightsFormBlockSchema = z.object({
	is_disabled: z.coerce.boolean().default(false),
	role: z.nativeEnum(Role).default(Role.USER), 
});

type UserAccessRightsFormBlockValues = z.infer<typeof UserAccessRightsFormBlockSchema>;

const UserAccessRightsFormBlock = () => {

	const { user } = useUser();

	const form = useFormContext<UserAccessRightsFormBlockValues>();

	return (
		<>
			<FormField
				control={ form.control }
				name="is_disabled"
				render={ ({ field }) => (
					<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
						<div className="space-y-0.5">
							<FormLabel className="text-base">
								Disable user account
							</FormLabel>
							<FormDescription>
								This user won&apos;t be able to log in.
							</FormDescription>
						</div>
						<FormControl>
							<Switch
								checked={ field.value }
								disabled={ user?.role === Role.OWNER }
								onBlur={ field.onBlur }
								onCheckedChange={ field.onChange }
							/>
						</FormControl>
					</FormItem>
				) }
			/>
			<FormField
				control={ form.control }
				name="role"
				render={ ({ field }) => {

					const handleChange = (value: string) => {
						field.onChange(value as Role);
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
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value={ Role.USER }>User</SelectItem>
									<SelectItem value={ Role.ADMIN }>Admin</SelectItem>
									<SelectItem
										value={ Role.OWNER }
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
		</>
	);
};

export default UserAccessRightsFormBlock;