'use client';

import { HTMLAttributes } from 'react';

type TabsListProps = HTMLAttributes<HTMLDivElement>;

const TabsList = ({ children, className, ...rest }: TabsListProps) => {
	return (
		<div
			{ ...rest }
			className={ `inline-flex gap-2 rounded-md bg-muted p-2 text-muted-foreground items-center justify-center ${ className }` }
		>
			{ children }
		</div>
	);
};

export default TabsList;