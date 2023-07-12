import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// import Sidebar from '@/components/layout/Sidebar';

const DynamicSidebar = dynamic(() => import('@/components/layout/Sidebar'));

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {

	return (
		<div>
			<DynamicSidebar />
			<div className="ml-[200px] p-8">
				{ children }
			</div>
		</div>
	);
};

export default AppLayout;