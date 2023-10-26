import { ReactNode } from 'react';

import { Role } from '@/schemas/role.schema';
import { setServerAuthGuard } from '@/utils/auth';

type UsersLayoutProps = {
	children: ReactNode;
};

const UsersLayout = async ({ children }: UsersLayoutProps) => {

	await setServerAuthGuard({
		rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
		redirect: '/', 
	});

	return (
		<>
			{ children }
		</>
	);
};

export default UsersLayout;