'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ErrorPage = () => {

	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	return (
		<div className="min-h-screen flex justify-center items-center">
			<div className="flex flex-col gap-4 items-center">
				<Card className="lg:min-w-[420px]">
					<CardHeader>
						<CardTitle>Error</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{ error }</p>
					</CardContent>
					<CardFooter className="flex-col gap-4">
						<Separator orientation="horizontal" />
						<Button
							className="gap-2 items-center"
							role="link"
							variant="link"
							asChild
						>
							<Link href="/signin"><ChevronLeft size="16" />Go back to sign in</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default ErrorPage;