'use client';

import { Settings } from 'lucide-react';
import { useEffect } from 'react';

import useHeader from '@/context/layout/header/useHeader';

const SettingsPageEffects = () => {

	const { setTitle } = useHeader();

	useEffect(() => {
		setTitle(<><Settings /> Settings</>);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export default SettingsPageEffects;