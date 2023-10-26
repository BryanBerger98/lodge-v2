'use client';

import { createContext } from 'react';
import { KeyedMutator } from 'swr';

import { FetchSettingsResponse } from '@/hooks/settings/useFetchSettings';
import { SettingName, SettingPopulated, UnregisteredSettingPopulated } from '@/schemas/setting';
import { LoadingStateError, LoadingState } from '@/types/utils/loading.type';
import { SettingNameType } from '@/utils/settings';

import { SetSettingsStatePayload } from './settings.actions';
import { SettingsState } from './settings.reducer';

type SettingsContextValues = SettingsState & {
	setSettingsState: (newState: SetSettingsStatePayload) => void;
	updateSettings: (...settingsToUpdate: UnregisteredSettingPopulated[]) => void;
	setLoadingState: <T extends LoadingState, E extends LoadingStateError<T>>(loading: T, ...error: E) => void;
	refetchSettings: KeyedMutator<FetchSettingsResponse>;
	getSetting: <T extends SettingName>(name: T) => UnregisteredSettingPopulated<SettingNameType<T>> | SettingPopulated<SettingNameType<T>> | undefined;
}

const SettingsContext = createContext<SettingsContextValues | null>(null);
export default SettingsContext;
