export type LoadingState = 'idle' | 'pending' | 'error';
export type LoadingStateError<L extends LoadingState> = L extends 'error' ? [string] : [undefined?];