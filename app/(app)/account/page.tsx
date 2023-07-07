import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const AccountPage = async () => {

	const session = await getServerSession(authOptions);

	return (
		<h1>Welcome { session?.user.email || 'User' } !</h1>
	);
};

export default AccountPage;