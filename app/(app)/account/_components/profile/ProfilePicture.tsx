'use client';

import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuth from '@/context/auth/useAuth';

const ProfilePicture = () => {

	const { currentUser } = useAuth();

	return (
		<Avatar className="w-28 h-28">
			<AvatarImage
				alt="Profile"
				src={ currentUser?.photo?.url }
			/>
			<AvatarFallback><User /></AvatarFallback>
		</Avatar>
	);
};

export default ProfilePicture;