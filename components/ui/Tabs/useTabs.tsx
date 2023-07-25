import { useContext } from 'react';

import { TabsContext } from './index';

const useTabs = () => {
	const context = useContext(TabsContext);
	if (context === null) {
		throw new Error('TabsContext is null');
	}
	if (context === undefined) {
		throw new Error('TabsContext was used outside of its Provider');
	}
	return context;
};

export default useTabs;