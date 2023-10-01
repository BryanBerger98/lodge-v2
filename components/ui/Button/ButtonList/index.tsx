import { PropsWithChildren } from 'react';

const ButtonList = ({ children }: PropsWithChildren<{}>) => {
	
	return (
		<div className="flex flex-col gap-0">
			{ children }
		</div>
	);
};

export default ButtonList;