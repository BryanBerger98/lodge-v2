'use client';

import { createContext } from 'react';
import { KeyedMutator } from 'swr';

import { FetchSettingsResponse } from '@/hooks/settings/useFetchSettings';
import { ISettingPopulated, IUnregisteredSettingPopulated } from '@/types/setting.type';
import { LoadingStateError, LoadingState } from '@/types/utils/loading.type';
import { SettingName, SettingNameType } from '@/utils/settings';

import { SetSettingsStatePayload } from './settings.actions';
import { SettingsState } from './settings.reducer';

type SettingsContextValues = SettingsState & {
	setSettingsState: (newState: SetSettingsStatePayload) => void;
	updateSettings: (...settingsToUpdate: IUnregisteredSettingPopulated[]) => void;
	setLoadingState: <T extends LoadingState, E extends LoadingStateError<T>>(loading: T, ...error: E) => void;
	refetchSettings: KeyedMutator<FetchSettingsResponse>;
	getSetting: <T extends SettingName>(name: T) => IUnregisteredSettingPopulated<SettingNameType<T>> | ISettingPopulated<SettingNameType<T>> | undefined;
}

const SettingsContext = createContext<SettingsContextValues | null>(null);
export default SettingsContext;
