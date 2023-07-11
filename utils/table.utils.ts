import { SortingState } from '@tanstack/react-table';

export const getSortingFromURLParams = (sortFields: string | null, sortDirections: string | null): SortingState => {
	if (sortFields && sortDirections) {
		const sortIds = sortFields.split(',');
		const sortDir = sortDirections.split(',').map(dir => Number(dir));
		return sortIds.map(id => ({
			id,
			desc: Number(sortDir) === -1 ? true : false,
		}));
	}
	return [];
};