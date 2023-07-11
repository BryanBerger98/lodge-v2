import { ReactNode } from 'react';

import { setServerAuthGuard } from '@/utils/auth';

type UsersLayoutProps = {
	children: ReactNode;
};

const UsersLayout = async ({ children }: UsersLayoutProps) => {

	await setServerAuthGuard({
		rolesWhiteList: [ 'admin' ],
		redirect: '/', 
	});

	return (
		<>
			{ children }
		</>
	);
};

export default UsersLayout;