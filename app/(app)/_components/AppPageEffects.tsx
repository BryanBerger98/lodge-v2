'use client';

import { Home } from 'lucide-react';
import { useEffect } from 'react';

import useHeader from '@/context/layout/header/useHeader';

const AppPageEffects = () => {

	const { setTitle } = useHeader();

	useEffect(() => {
		setTitle(<><Home /> Dashboard</>);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export default AppPageEffects;