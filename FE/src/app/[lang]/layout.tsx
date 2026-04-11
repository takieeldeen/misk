import type { LanguageValue } from 'src/locales';

import { CONFIG } from 'src/config-global';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';
import { languages, LocalizationProvider } from 'src/locales';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  params: { lang: LanguageValue };
};

export default async function Layout({ children, params }: Props) {
  const { lang } = params;
  return (
    <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
      <LocalizationProvider>
        <AuthProvider>
          <SettingsProvider settings={defaultSettings}>
            <ThemeProvider>
              <MotionLazy>
                <ProgressBar />
                <SettingsDrawer />
                <Snackbar />

                {children}
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
