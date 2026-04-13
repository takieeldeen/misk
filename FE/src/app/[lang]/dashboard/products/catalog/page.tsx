import { CONFIG } from 'src/config-global';

import ListView from 'src/sections/products-catalog/views/list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product Catalog | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ListView />;
}
