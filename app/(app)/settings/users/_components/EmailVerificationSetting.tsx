'use client';

import { Switch } from '@/components/ui/switch';
import { Paragraph } from '@/components/ui/Typography/text';

const EmailVerificationSetting = () => {
	return (
		<div className="rounded-lg border p-4 mb-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col pr-4">
					<Paragraph variant="medium">Email verification</Paragraph>
					<Paragraph variant="muted">Users must verify their email when they sign up or update their email address to access the whole app.</Paragraph>
				</div>
				<Switch />
			</div>
		</div>
	);
};

export default EmailVerificationSetting;