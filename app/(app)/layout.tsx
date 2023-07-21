'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

import SettingsProvider from '@/context/settings';

const DynamicSidebar = dynamic(() => import('@/components/layout/Sidebar'));

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {

	return (
		<div>
			<SettingsProvider>
				<DynamicSidebar />
			</SettingsProvider>
			<div className="ml-[200px] p-8">
				{ children }
			</div>
		</div>
	);
};

export default AppLayout;