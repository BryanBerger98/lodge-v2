'use client';

import { User } from 'lucide-react';
import { useEffect } from 'react';

import useHeader from '@/context/layout/header/useHeader';

const AccountPageEffects = () => {

	const { setTitle } = useHeader();

	useEffect(() => {
		setTitle(<><User /> Users</>);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export default AccountPageEffects;