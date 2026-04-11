import { createLoader, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs/server';

import { PAGINATION } from 'src/config/constants';

export const brandParams = {
  name: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
    throttleMs: 500,
  }),
  status: parseAsArrayOf(parseAsString).withDefault([]).withOptions({
    clearOnDefault: true,
  }),
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
  }),
};

export const loadSearchParams = createLoader(brandParams);
