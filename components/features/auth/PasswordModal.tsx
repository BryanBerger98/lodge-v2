/* eslint-disable react/jsx-handler-names */
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { object, string, z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/ui.util';

export type PasswordModalOpenChangeEvent = ({ openState, password }: { openState: boolean, password: string }) => void;

type PasswordModalProps = {
	isOpen: boolean;
	onOpenChange: PasswordModalOpenChangeEvent;
	title?: ReactNode;
	description?: ReactNode;
	variant?: 'default' | 'destructive';
}

const PasswordModal = ({ isOpen, onOpenChange, title, description, variant= 'default' }: PasswordModalProps) => {

	const passwordFormSchema = object({ password: string().min(1, 'Required.') });

	const form = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: { password: '' },
		mode: 'onSubmit',
	});
	
	const handleSubmitPasswordForm = ({ password }: z.infer<typeof passwordFormSchema>) => {
		onOpenChange({
			openState: false,
			password, 
		});
		form.reset();
	};

	const handleOpenChange = (openState: boolean) => {
		onOpenChange({
			openState,
			password: '', 
		});
		form.reset();
	};

	const handleCancel = () => {
		onOpenChange({
			openState: false,
			password: '', 
		});
		form.reset();
	};

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ handleOpenChange }
		>
			<DialogContent
				className="sm:max-w-[425px]"
			>
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmitPasswordForm) }>
						<DialogHeader className="mb-4">
							<DialogTitle
								className={ cn({ 'text-destructive': variant === 'destructive' }) }
							>{ title || 'We keep your account safe.' }
							</DialogTitle>
							<DialogDescription>
								{ description || 'We need you to enter your password to confirm this action.' }
							</DialogDescription>
						</DialogHeader>
						<FormField
							control={ form.control }
							name="password"
							render={ ({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
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
								type="button"
								variant="outline"
								onClick={ handleCancel }
							>
								<X size="16" />
								Cancel
							</Button>
							<Button
								className="gap-2"
								type="submit"
								variant={ variant }
							>
								<Check size="16" />
								Confirm
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default PasswordModal;