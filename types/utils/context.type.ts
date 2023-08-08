export type ReducerAction<T> = {
	type: string;
	payload: T;
};