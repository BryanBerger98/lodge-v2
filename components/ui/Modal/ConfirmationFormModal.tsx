/* eslint-disable react/jsx-handler-names */
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { object, string, z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export type ConfirmationModalOpenChangeEvent = ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => void;

type ConfirmationFormModalProps = {
	isOpen: boolean;
	onOpenChange: ConfirmationModalOpenChangeEvent;
	title?: ReactNode;
	description?: ReactNode;
	valueToValidate: string;
	inputLabel?: string;
	inputPlaceholder?: string;
	variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link';
	isLoading?: boolean;
	inputType?: 'text' | 'password' | 'email';
}

const ConfirmationFormModal = ({ isOpen, onOpenChange, title, description, valueToValidate, inputLabel, variant = 'default', inputType = 'text', isLoading = false, inputPlaceholder = '' }: ConfirmationFormModalProps) => {

	const confirmationFormSchema = object({ keyToValidate: string().refine(value => value === valueToValidate, { message: 'Invalid input.' }) });

	const form = useForm<z.infer<typeof confirmationFormSchema>>({
		resolver: zodResolver(confirmationFormSchema),
		defaultValues: { keyToValidate: '' },
		mode: 'onSubmit',
	});
	
	const handleSubmitForm = () => {
		onOpenChange({
			openState: false,
			isConfirmed: true, 
		});
		form.reset();
	};

	const handleOpenChange = (openState: boolean) => {
		onOpenChange({
			openState,
			isConfirmed: false, 
		});
		form.reset();
	};

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ !isLoading ? handleOpenChange : undefined }
		>
			<DialogContent
				className="sm:max-w-[425px]"
			>
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmitForm) }>
						<DialogHeader className="mb-4">
							<DialogTitle className={ variant === 'destructive' ? 'text-red-500' : '' }>{ title || 'This action needs to be confirmed.' }</DialogTitle>
							<DialogDescription>
								{ description || 'If you are sure you want to perform this action, please fill the form below.' }
							</DialogDescription>
						</DialogHeader>
						<FormField
							control={ form.control }
							name="keyToValidate"
							render={ ({ field }) => (
								<FormItem>
									{ inputLabel ? <FormLabel className="capitalize">{ inputLabel }</FormLabel> : null }
									<FormControl>
										<Input
											placeholder={ inputPlaceholder }
											type={ inputType }
											{ ...field }
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							) }
						/>
						<DialogFooter className="mt-4">
							<Button
								className="gap-2"
								disabled={ isLoading || !form.formState.isValid }
								type="submit"
								variant={ variant }
							>
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check /> }
								Validate
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationFormModal;