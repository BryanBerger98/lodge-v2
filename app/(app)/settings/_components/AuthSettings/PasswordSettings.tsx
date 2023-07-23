import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card } from '@/components/ui/card';

const passwordSettingsFormSchema = z.object({
	should_contain_uppercase: z.boolean().default(false).optional(),
	should_contain_lowercase: z.boolean().default(false).optional(),
	should_contain_numbers: z.boolean().default(false).optional(),
	should_contain_symbols: z.boolean().default(false).optional(),
	min_length: z.number().default(8).optional(),
});
type PasswordSettingsProps = {
	csrfToken: string;
};

const PasswordSettings = ({ csrfToken }: PasswordSettingsProps) => {

	const form = useForm<z.infer<typeof passwordSettingsFormSchema>>({
		resolver: zodResolver(passwordSettingsFormSchema),
		defaultValues: {
			should_contain_uppercase: false,
			should_contain_lowercase: false,
			should_contain_numbers: false,
			should_contain_symbols: false,
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