/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown, Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ComboOption, Combobox } from '@/components/ui/combobox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import SearchSelect from '@/components/ui/Select/SearchSelect';
import { Switch } from '@/components/ui/switch';
import { fetchUsers } from '@/services/users.service';

const shareSettingsFormSchema = z.object({
	share_with_admin: z.boolean().default(false).optional(),
	owner: z.string().optional(),
});

const ShareSettings = () => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isSearchLoading, setIsSearchLoading ] = useState<boolean>(false);
	const [ searchedOptions, setSearchedOptions ] = useState<ComboOption[]>([]);

	const form = useForm<z.infer<typeof shareSettingsFormSchema>>({
		resolver: zodResolver(shareSettingsFormSchema),
		defaultValues: {
			share_with_admin: false,
			owner: '',
		},
		mode: 'onSubmit',
	});

	const handleSearch = async (value: string) => {
		try {
			setIsSearchLoading(true);
			const data = await fetchUsers({
				search: value,
				roles: [ 'admin', 'user' ],
			});
			console.log(value);
			console.log(data.users);
			const options = value ? data.users.map(user => ({
				value: user.id.toString(),
				label: `${ user.email }<${ user.username || 'No name' }>`,
			})) : [];
			setSearchedOptions(options);
		} catch (error) {
			console.error(error);
		} finally {
			setIsSearchLoading(false);
		}
	};

	const handleSubmitShareForm = (values: z.infer<typeof shareSettingsFormSchema>) => {
		console.log(values);
	};

	return (
		<Card>
			<Form { ...form }>
				<form onSubmit={ form.handleSubmit(handleSubmitShareForm) }>
					<CardHeader>
						<CardTitle>Share settings</CardTitle>
						<CardDescription>Manage who has access to settings.</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={ form.control }
							name="share_with_admin"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Share settings with admin
										</FormLabel>
										<FormDescription>
											If this option is active, users with admin role could see and edit these settings.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={ field.value }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="owner"
							render={ ({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Owner</FormLabel>
									<SearchSelect
										isLoading={ isSearchLoading }
										options={ searchedOptions }
										value={ field.value }
										onSearch={ handleSearch }
										onSelect={ field.onChange }
									>
										<Button
											className="w-full justify-between"
											role="combobox"
											variant="outline"
										>
											{
									 			field.value
													? searchedOptions.find(
														(option) => option.value === field.value
													)?.label
													: 'Select a user as owner'
											}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</SearchSelect>
									<FormDescription>
										Select user to tranfer ownership.
									</FormDescription>
								</FormItem>
							) }
						/>
					</CardContent>
					<CardFooter className="gap-4 justify-end">
						<Button
							className="gap-2"
							type="button"
							variant="outline"
						>
							<X />
							Cancel
						</Button>
						<Button
							className="gap-2"
							disabled={ isLoading }
							type="submit"
						>
							{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
							Save
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};

export default ShareSettings;