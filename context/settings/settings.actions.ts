import { UpdateUnregisteredSettingPopulated } from '@/schemas/setting';

import { SettingsState } from './settings.reducer';

export const SETTINGS_SET_STATE_ACTION = 'settings/setState';
export const SETTINGS_UPDATE_ACTION = 'users/update';
export const SETTINGS_PENDING_ACTION = 'users/pending';
export const SETTINGS_ERROR_ACTION = 'users/error';
export const SETTINGS_IDLE_ACTION = 'users/idle';

export type SetSettingsStatePayload = Partial<Omit<SettingsState, 'loading' | 'error'>>; 
type SetSettingsStateAction = {
	type: typeof SETTINGS_SET_STATE_ACTION;
	payload: SetSettingsStatePayload;
}

export type UpdateSettingsPayload = UpdateUnregisteredSettingPopulated[];
type UpdateSettingsAction = {
	type: typeof SETTINGS_UPDATE_ACTION;
	payload: UpdateSettingsPayload;
}

type PendingSettingsAction = {
	type: typeof SETTINGS_PENDING_ACTION;
}

export type ErrorSettingsPayload = string;
type ErrorSettingsAction = {
	type: typeof SETTINGS_ERROR_ACTION;
	payload: ErrorSettingsPayload;
}

type IdleSettingsAction = {
	type: typeof SETTINGS_IDLE_ACTION;
}

export type SettingsReducerAction = SetSettingsStateAction | UpdateSettingsAction | PendingSettingsAction | ErrorSettingsAction | IdleSettingsAction;