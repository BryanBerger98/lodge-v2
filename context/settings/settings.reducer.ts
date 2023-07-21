import { Reducer } from 'react';

import { LoadingState } from '@/types/loading.type';
import { UnregisteredSetting } from '@/types/setting.type';

import { SETTINGS_ERROR_ACTION, SETTINGS_IDLE_ACTION, SETTINGS_PENDING_ACTION, SETTINGS_SET_STATE_ACTION, SETTINGS_UPDATE_ACTION, SettingsReducerAction } from './settings.actions';

export type SettingsState = {
	settings: UnregisteredSetting[];
	loading: LoadingState;
	error?: string;
}

const usersReducer: Reducer<SettingsState, SettingsReducerAction> = (state, action) => {
	switch (action.type) {
		case SETTINGS_SET_STATE_ACTION:
			return {
				...state,
				...action.payload, 
			};
		case SETTINGS_IDLE_ACTION:
			return {
				...state,
				loading: 'idle',
			};
		case SETTINGS_PENDING_ACTION:
			return {
				...state,
				loading: 'pending',
			};
		case SETTINGS_ERROR_ACTION:
			return {
				...state,
				loading: 'error',
				error: action.payload,
			};
		case SETTINGS_UPDATE_ACTION:
			return {
				...state,
				settings: state.settings.map(setting => {
					const settingToUpdate = action.payload.find(({ name }) => name === setting.name);
					if (settingToUpdate) {
						return {
							...setting,
							...settingToUpdate,
						};
					}
					return setting;
				}),
			};
		default:
			return state;
	}
};

export default usersReducer;