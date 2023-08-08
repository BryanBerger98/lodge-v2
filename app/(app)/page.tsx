import { Home } from 'lucide-react';

import PageTitle from '@/components/layout/Header/PageTitle';

const AppPage = () => {

	return (
		<>
			<PageTitle><Home /> Dashboard</PageTitle>
			<p className="text-slate-500">Here will be the dashboard page.</p>
		</>
	);
};

export default AppPage;