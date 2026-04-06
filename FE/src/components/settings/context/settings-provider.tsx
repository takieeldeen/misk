'use client';

import type { ThemeDirection } from 'src/theme/types';

import { useMemo, useState, useCallback, createContext } from 'react';

import { useParams } from 'src/routes/hooks';

import { useCookies } from 'src/hooks/use-cookies';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEY, defaultSettings } from '../config-settings';

import type { SettingsState, SettingsContextValue, SettingsProviderProps } from '../types';

// ----------------------------------------------------------------------

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsConsumer = SettingsContext.Consumer;

// ----------------------------------------------------------------------

export function SettingsProvider({
  children,
  settings,
  caches = 'localStorage',
}: SettingsProviderProps) {
  const params = useParams();

  const lang = params?.lang;

  const cookies = useCookies<SettingsState>(STORAGE_KEY, settings, defaultSettings);

  const localStorage = useLocalStorage<SettingsState>(STORAGE_KEY, settings);

  const values = caches === 'cookie' ? cookies : localStorage;

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...values.state,
      direction: (lang === 'ar' ? 'rtl' : 'ltr') as ThemeDirection,
      fontFamily: lang === 'ar' ? 'Cairo' : values.state.fontFamily,
      canReset: values.canReset,
      onReset: values.resetState,
      onUpdate: values.setState,
      onUpdateField: values.setField,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    }),
    [
      lang,
      values.state,
      values.setField,
      values.setState,
      values.canReset,
      values.resetState,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
