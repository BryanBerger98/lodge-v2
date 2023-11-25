'use client';

import { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Heading1 } from '@/components/ui/Typography/heading';
import { Env, isProductionEnv } from '@/utils/env.util';

type PageHeaderTitleProps = {
	children: ReactNode;
};

const PageHeaderTitle = ({ children }: PageHeaderTitleProps) => {

	return (
		<div className="flex flex-col">
			<Heading1 className="text-xl lg:text-xl font-medium flex gap-2 items-center">{ children }</Heading1>
			{
				!isProductionEnv(Env.NEXT_PUBLIC_ENVIRONMENT) ?
					<Badge
						className="w-fit mx-auto"
						variant="destructive"
					>{ Env.NEXT_PUBLIC_ENVIRONMENT }
					</Badge>
					: null
			}
		</div>
	);
};

export default PageHeaderTitle;