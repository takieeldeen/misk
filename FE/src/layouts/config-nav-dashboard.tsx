import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      /**
       * Overview
       */
      {
        subheader: t('navbar.overview'),
        items: [
          { title: t('navbar.insights'), path: paths.dashboard.root, icon: ICONS.dashboard },
          {
            title: t('navbar.categories'),
            path: paths.dashboard.categories.list,
            icon: <Iconify icon="game-icons:liquid-soap" />,
          },
          {
            title: t('navbar.brands'),
            path: paths.dashboard.brands,
            icon: <Iconify icon="solar:shop-bold" />,
          },
        ],
      },
      /**
       * Management
       */
      {
        subheader: t('navbar.management'),
        items: [
          {
            title: t('navbar.products'),
            path: paths.dashboard.products.root,
            icon: ICONS.user,
            children: [
              { title: t('navbar.catalog'), path: paths.dashboard.products.catalog },
              { title: t('navbar.variants'), path: paths.dashboard.products.variants },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
