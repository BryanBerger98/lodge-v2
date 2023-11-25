'use client';

import { ReactNode } from 'react';

type PageHeaderProps = {
	children: ReactNode;
}

const PageHeader = ({ children }: PageHeaderProps) => {

	return (
		<div className="bg-white drop-shadow-sm p-4 flex md:hidden justify-center relative mb-4">
			{ children }
		</div>
	);
};

export default PageHeader;