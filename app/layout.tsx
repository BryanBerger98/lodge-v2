import './globals.css';

import Providers from './_components/Providers';

export const metadata = {
	title: 'Lodge V2',
	description: 'Next.js starter app',
};

const RootLayout = ({ children }: {
  children: React.ReactNode
}) => {
	return (
		<html lang="en">
			<body className="min-h-screen">
				<Providers>
					{ children }
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
