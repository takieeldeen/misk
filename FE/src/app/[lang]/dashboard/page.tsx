import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';
import InsightsView from 'src/sections/insights/views/insights-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <InsightsView />;
}
