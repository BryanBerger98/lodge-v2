'use client';

import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GoogleAuthButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);

	const { toast } = useToast();

	const handleSignInWithGoogle = async () => {
		try {
			setIsLoading(true);
			const data = await signIn('google', { callbackUrl: '/' });
			if (data?.error) {
				console.error(data.error);
				toast({
					title: 'Error',
					description: 'An error occured.',
					variant: 'destructive',
				});
			} else {
				console.log(data);
			}
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				description: 'An error occured.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			className="gap-2 w-full"
			disabled={ isLoading }
			type="button"
			variant="outline"
			onClick={ handleSignInWithGoogle }
		>
			{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon size="16" /> }
			Sign in with Google
		</Button>
	);
};

export default GoogleAuthButton;