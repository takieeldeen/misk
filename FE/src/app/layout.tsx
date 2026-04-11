import 'src/global.css';
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/500.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/800.css';
// fonts
import '@fontsource/cairo/index.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { schemeConfig } from 'src/theme/scheme-config';

import { Snackbar } from 'src/components/snackbar';
import TanstackProvider from 'src/components/providers/tanstack-provider';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TanstackProvider>
          <NuqsAdapter>
            <InitColorSchemeScript
              defaultMode={schemeConfig.defaultMode}
              modeStorageKey={schemeConfig.modeStorageKey}
            />
            {children}
          </NuqsAdapter>
        </TanstackProvider>
      </body>
    </html>
  );
}
