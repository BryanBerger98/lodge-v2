import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card } from '@/components/ui/card';

const passwordSettingsFormSchema = z.object({
	uppercase_min: z.number().default(0).optional(),
	lowercase_min: z.number().default(0).optional(),
	numbers_min: z.number().default(0).optional(),
	symbols_min: z.number().default(0).optional(),
	should_contain_unique_chars: z.boolean().default(false).optional(),
	min_length: z.number().default(8).optional(),
});
type PasswordSettingsProps = {
	csrfToken: string;
};

const PasswordSettings = ({ csrfToken }: PasswordSettingsProps) => {

	const form = useForm<z.infer<typeof passwordSettingsFormSchema>>({
		resolver: zodResolver(passwordSettingsFormSchema),
		defaultValues: {
			uppercase_min: 0,
			lowercase_min: 0,
			numbers_min: 0,
			symbols_min: 0,
			should_contain_unique_chars: false,
			min_length: 8,
		},
		mode: 'onTouched',
	});

	return (
		<Card>
			
		</Card>
	);
};

export default PasswordSettings;