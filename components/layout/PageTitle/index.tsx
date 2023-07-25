import { HTMLAttributes } from 'react';

type PageTitleProps = HTMLAttributes<HTMLHeadingElement>;

const PageTitle = ({ children, className, ...rest }: PageTitleProps) => {
	return (
		<h1
			{ ...rest }
			className={ `text-2xl font-semibold flex gap-2 items-center mb-16 ${ className }` }
		>{ children }
		</h1>
	);
};

export default PageTitle;