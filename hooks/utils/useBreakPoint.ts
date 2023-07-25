import { useEffect, useState } from 'react';

import { BREAKPOINTS, BreakPoint, getBreakPoint } from '@/utils/ui.util';

const useBreakPoint = () => {

	const [ xsBreakPoint ] = BREAKPOINTS;
	const [ breakPoint, setBreakPoint ] = useState<BreakPoint>(xsBreakPoint);
	
	useEffect(() => {
		const resizeHandler = () => {
			const currentWindowWidth = document.documentElement.clientWidth || window.innerWidth;
			const currentBreakPoint = getBreakPoint(currentWindowWidth);
			setBreakPoint(currentBreakPoint);
		};
		resizeHandler();
		window.addEventListener('resize', resizeHandler);
		return () => window.removeEventListener('resize', resizeHandler);
	}, []);
	
	return breakPoint;

};

export default useBreakPoint;