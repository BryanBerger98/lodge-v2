'use client';

import { ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';

import useFetchSettings from '@/hooks/settings/useFetchSettings';
import { SettingName, SettingPopulated, UnregisteredSettingPopulated, UpdateUnregisteredSettingPopulated } from '@/schemas/setting';
import { LoadingStateError, LoadingState } from '@/types/utils/loading.type';
import { findDefaultSettingByName, InferUnregisteredSettingPopulatedArray, SettingNameType } from '@/utils/settings';
import { DEFAULT_SETTINGS } from '@/utils/settings/default-settings.util';

import { SetSettingsStatePayload, SETTINGS_ERROR_ACTION, SETTINGS_IDLE_ACTION, SETTINGS_PENDING_ACTION, SETTINGS_SET_STATE_ACTION, SETTINGS_UPDATE_ACTION } from './settings.actions';
import settingsReducer, { SettingsState } from './settings.reducer';

import SettingsContext, { SettingsContextValues } from '.';

const INITIAL_STATE: SettingsState = {
	settings: DEFAULT_SETTINGS,
	loading: 'idle',
};

type SettingsProviderProps = {
	children: ReactNode;
	settings?: UnregisteredSettingPopulated[] | SettingPopulated[],
}

const SettingsProvider = ({ settings: initialSettingsState = [], children }: SettingsProviderProps) => {

	const [ state, dispatch ] = useReducer(settingsReducer, {
		...INITIAL_STATE,
		settings: initialSettingsState, 
	});

	const { refetch, data, isLoading, error } = useFetchSettings();

	const updateSettings = useCallback((...settingssToUpdate: UpdateUnregisteredSettingPopulated[]) => {
		dispatch({
			type: SETTINGS_UPDATE_ACTION,
			payload: settingssToUpdate,
		});
	}, []);

	const setSettingsState = useCallback((newState: SetSettingsStatePayload) => {
		dispatch({
			type: SETTINGS_SET_STATE_ACTION,
			payload: newState,
		});
	}, []);

	const setLoadingState = useCallback(<T extends LoadingState>(loading: T, ...error: LoadingStateError<T>) => {
		switch (loading) {
			case 'pending':
				dispatch({ type: SETTINGS_PENDING_ACTION });
				break;
			case 'error':
				dispatch({
					type: SETTINGS_ERROR_ACTION,
					payload: error[ 0 ] as string,
				});
				break;
			default:
				dispatch({ type: SETTINGS_IDLE_ACTION });
				break;
		}
	}, []);

	const getSetting = useCallback(<T extends SettingName>(name: T): UnregisteredSettingPopulated<SettingNameType<T>> | undefined => {
		const settingFromState: UnregisteredSettingPopulated<SettingNameType<T>> | undefined = state.settings.find(setting => setting.name === name) as UnregisteredSettingPopulated<SettingNameType<T>> | undefined;
		if (settingFromState) return settingFromState;
		const defaultSetting = findDefaultSettingByName(name);
		return defaultSetting as UnregisteredSettingPopulated<SettingNameType<T>> | undefined;
	}, [ state ]);

	const getSettings = useCallback(<T extends ReadonlyArray<SettingName>>(...names: T): InferUnregisteredSettingPopulatedArray<T> => {
		return names.map(name => getSetting(name)) as any;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ state ]);

	useEffect(() => {
		if (isLoading) {
			setLoadingState('pending');
		}
		if (error) {
			console.error(error);
			setLoadingState('error', error.message);
		}
		if (data) {
			setSettingsState({ settings: data.settings });
			setLoadingState('idle');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isLoading, error, data ]);

	const contextValues: SettingsContextValues = useMemo(() => ({
		...state,
		setSettingsState,
		updateSettings,
		setLoadingState,
		refetchSettings: refetch,
		getSetting,
		getSettings,
	}), [
		state,
		setSettingsState,
		updateSettings,
		setLoadingState,
		refetch,
		getSetting,
		getSettings,
	]);

	return(
		<SettingsContext.Provider value={ contextValues }>
			{ children }
		</SettingsContext.Provider>
	);

};

export default SettingsProvider;