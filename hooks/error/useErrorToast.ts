import { FieldValues, UseFormReturn } from 'react-hook-form';

import { useToast } from '@/components/ui/use-toast';
import { ApiError } from '@/utils/api/error';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';
import { buildFormError } from '@/utils/error.util';

type UseErrorToastOptions = {
	logError?: boolean,
};

type ToastError = {
	title: string,
	description: string,
}

const useErrorToast = (options?: UseErrorToastOptions) => {

	const { toast } = useToast();

	const { logError = true } = options || {};

	const triggerErrorToast = <T extends FieldValues = FieldValues>(error: ToastError | ApiError<unknown>, form?: UseFormReturn<T>) => {

		if ('title' in error) {
			toast({
				title: error.title,
				description: error.description,
				variant: 'destructive',
			});
			return;
		}

		if (logError) console.error(error);

		if (form) {
			buildFormError(error, {
				form,
				logError: false, 
			});
		}

		toast({
			title: 'Error',
			description: getErrorMessage(error),
			variant: 'destructive',
		});
	};

	return { triggerErrorToast };
};

export default useErrorToast;