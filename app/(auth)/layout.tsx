import { ReactNode } from 'react';

type AuthLayoutProps = {
	children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {

	return (
		<div className="container !w-auto">
			{ children }
		</div>
	);
};

export default AuthLayout;