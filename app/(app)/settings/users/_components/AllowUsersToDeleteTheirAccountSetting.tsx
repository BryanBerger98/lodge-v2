'use client';

import { Switch } from '@/components/ui/switch';
import { Paragraph } from '@/components/ui/Typography/text';

const AllowUsersToDeleteTheirAccountSetting = () => {
	return (
		<div className="rounded-lg border p-4 mb-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<Paragraph variant="medium">Allow users to delete their account</Paragraph>
					<Paragraph variant="muted">Users can delete their account and all data relative to their account.</Paragraph>
				</div>
				<Switch />
			</div>
		</div>
	);
};

export default AllowUsersToDeleteTheirAccountSetting;