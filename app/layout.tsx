import './globals.css';

import PageProgressBar from '@/components/layout/PageProgressBar';
import { Toaster } from '@/components/ui/toaster';

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
				<PageProgressBar />
				<Providers>
					{ children }
				</Providers>
				<Toaster />
			</body>
		</html>
	);
};

export default RootLayout;
