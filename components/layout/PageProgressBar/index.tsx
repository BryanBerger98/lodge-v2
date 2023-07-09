'use client';

import { AppProgressBar } from 'next-nprogress-bar';

const PageProgressBar = () => (
	<AppProgressBar
		color="#0f172a"
		delay={ 100 }
		height="3px"
		options={ { showSpinner: false } }
		shallowRouting
	/>
);

export default PageProgressBar;