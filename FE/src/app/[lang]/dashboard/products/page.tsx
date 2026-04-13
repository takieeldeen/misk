import { redirect } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Products | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  redirect(paths.dashboard.products.catalog);
}
