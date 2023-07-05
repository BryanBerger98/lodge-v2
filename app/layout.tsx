import './globals.css';
import { Inter } from 'next/font/google';

import Providers from './_components/Providers';

const inter = Inter({ subsets: [ 'latin' ] });

export const metadata = {
	title: 'Lodge V2',
	description: 'Next.js starter app',
};

const RootLayout = ({ children }: {
  children: React.ReactNode
}) => {
	return (
		<html lang="en">
			<body className={ inter.className }>
				<Providers>
					{ children }
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
