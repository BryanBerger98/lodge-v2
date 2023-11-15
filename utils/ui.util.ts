import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
 
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type ScreenType = 'mobile' | 'tablet' | 'laptop' | 'desktop';
export type BreakPointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type BreakPoint = {
	min?: number;
	max?: number;
	size: BreakPointName,
	screen: ScreenType;
};

export const BREAKPOINTS = [
	{
		size: 'xs',
		min: 0,
		max: 639,
		screen: 'mobile',
	},
	{
		size: 'sm',
		min: 640,
		max: 767,
		screen: 'tablet',
	},
	{
		size: 'md',
		min: 768,
		max: 1023,
		screen: 'tablet',
	},
	{
		size: 'lg',
		min: 1024,
		max: 1279,
		screen: 'laptop',
	},
	{
		size: 'xl',
		min: 1280,
		max: 1535, 
		screen: 'desktop',
	},
	{
		size: '2xl',
		min: 1536,
		screen: 'desktop', 
	},
] as const;


export const getBreakPoint = (windowWidth: number) => {
	const [ xsBreakPoint ] = BREAKPOINTS;
	return BREAKPOINTS.find(breakpoint => {
		if ('max' in breakpoint && windowWidth <= breakpoint.max && breakpoint.min && windowWidth >= breakpoint.min) {
			return true;
		}
		if (!('max' in breakpoint) && breakpoint.min && windowWidth >= breakpoint.min) {
			return true;
		}
		return false;
	}) || xsBreakPoint;
};