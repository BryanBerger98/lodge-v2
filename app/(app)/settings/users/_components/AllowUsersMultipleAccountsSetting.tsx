'use client';

import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Paragraph } from '@/components/ui/Typography/text';

const AllowUsersMultipleAccountsSetting = () => {
	return (
		<div className="rounded-lg border p-4 mb-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<Paragraph variant="medium">Allow users multiple accounts</Paragraph>
					<Paragraph variant="muted">Users can sign in to multiple different accounts at the same time.</Paragraph>
				</div>
				<TooltipProvider delayDuration={ 100 }>
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Switch disabled />
							</span>
						</TooltipTrigger>
						<TooltipContent>
							Coming soon
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default AllowUsersMultipleAccountsSetting;