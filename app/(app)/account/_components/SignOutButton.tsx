'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type SignOutButtonProps = {
	className?: string;
};

const SignOutButton = ({ className }: SignOutButtonProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();
	const { toast } = useToast();

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			await signOut({ redirect: false });
			router.replace('/signin');
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'An error occured',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			className={ `gap-2 ${ className }` }
			disabled={ isLoading }
			type="button"
			variant="destructive"
			onClick={ handleSignOut }
		>
			{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut /> }
			Sign out
		</Button>
	);
};

export default SignOutButton;