import { ReactNode } from 'react';

import Sidebar from '@/components/layout/Sidebar';

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {

	return (
		<div>
			<Sidebar />
			<div className="ml-[200px] p-8">
				{ children }
			</div>
		</div>
	);
};

export default AppLayout;