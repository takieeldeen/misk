'use client';

import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter, useParams, usePathname } from 'src/routes/hooks';

// eslint-disable-next-line import/no-cycle
import { toast } from 'src/components/snackbar';

import { allLangs } from './all-langs';
import { fallbackLng, changeLangMessages as messages } from './config-locales';

import type { LanguageValue } from './config-locales';

// ----------------------------------------------------------------------

export function useTranslate(ns?: string) {
  const router = useRouter();

  const pathname = usePathname();
  const { lang: resolvedLanguage } = useParams();
  const { t, i18n } = useTranslation(ns);
  const fallback = allLangs.filter((lang) => lang.value === fallbackLng)[0];
  const currentLang = allLangs.find((lang) => lang.value === resolvedLanguage);
  i18n.language = resolvedLanguage as LanguageValue;
  const onChangeLang = useCallback(
    async (newLang: LanguageValue) => {
      try {
        const langChangePromise = i18n.changeLanguage(newLang);

        const currentMessages = messages[newLang] || messages.en;

        toast.promise(langChangePromise, {
          loading: currentMessages.loading,
          success: () => currentMessages.success,
          error: currentMessages.error,
        });

        if (currentLang) {
          dayjs.locale(currentLang.adapterLocale);
        }

        const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLang}`);

        router.push(newPathname);

        router.refresh();
      } catch (error) {
        console.error(error);
      }
    },
    [currentLang, i18n, pathname, router]
  );

  return {
    t,
    i18n,
    onChangeLang,
    currentLang: currentLang ?? fallback,
  };
}
