import { useContext } from 'react';

import SettingsContext from '.';

const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings was used outside of its Provider');
	}
	return context;
};

export default useSettings;