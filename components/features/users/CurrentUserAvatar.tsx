'use client';

import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuth from '@/context/auth/useAuth';

const CurrentUserAvatar = () => {

	const { currentUser } = useAuth();

	return (
		<Avatar>
			<AvatarImage
				alt="Profile"
				height="40"
				src={ currentUser?.photo?.url || undefined }
				width="40"
			/>
			<AvatarFallback><User size="16" /></AvatarFallback>
		</Avatar>
	);
};

export default CurrentUserAvatar;