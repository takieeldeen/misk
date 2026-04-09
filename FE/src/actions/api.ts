import type { AxiosRequestConfig } from 'axios';

import axios from 'src/utils/axios';

export async function dummyPromise() {
  const test = new Promise((res) => {
    setTimeout(() => res({ myData: 's' }), 3000);
  });
  return test;
}

export function getFetcher<T = unknown>(url: string | [string, AxiosRequestConfig]) {
  return async () => {
    const URL = Array.isArray(url) ? url?.[0] : url;
    const config = Array.isArray(url) ? url?.[1] : undefined;
    const response = await axios.get(URL, config);
    return response.data as T; // usually we want only `data`
  };
}

export function postFetcher<T = unknown>(url: string | [string, AxiosRequestConfig]) {
  return async (data: any) => {
    const URL = Array.isArray(url) ? url?.[0] : url;
    const config = Array.isArray(url) ? url?.[1] : undefined;
    const response = await axios.post(URL, data, config);
    return response.data as T;
  };
}

export function patchFetcher<T = unknown>(url: string | [string, AxiosRequestConfig]) {
  return async (data: any) => {
    const URL = Array.isArray(url) ? url?.[0] : url;
    const config = Array.isArray(url) ? url?.[1] : undefined;
    const response = await axios.patch(URL, data, config);
    return response.data as T;
  };
}

export function deleteFetcher<T = unknown>(url: string | [string, AxiosRequestConfig]) {
  return async (data?: any) => {
    const URL = Array.isArray(url) ? url?.[0] : url;
    const config = Array.isArray(url) ? url?.[1] : undefined;
    const response = await axios.delete(URL, { ...config, data });
    return response.data as T;
  };
}
export function getDummyFetcher<T = unknown>(data: T) {
  return async () => {
    await dummyPromise();
    return data as T; // usually we want only `data`
  };
}

export function dummyFetcher<T>(
  data: T,
  URL: string | [string, AxiosRequestConfig],
  paginated: boolean = false,
  nameAttribute?: string
) {
  const page = (URL?.[1] as any)?.params?.page ? (URL?.[1] as any).params.page - 1 : 0;
  const size = (URL?.[1] as any)?.params?.size;
  const name = (URL?.[1] as any)?.params?.name ?? '';
  const nameAttr = nameAttribute ?? 'nameAr';
  const entityKey = paginated
    ? Object?.keys(data as any)?.find((key: string) => Array.isArray((data as any)?.[key]))
    : undefined;
  const filteredTotalNoOfRows = entityKey
    ? (data as any)?.[entityKey]?.filter(
        (el: any) =>
          el?.nameAr?.includes(name) || el?.nameEn?.includes(name) || el?.[nameAttr]?.includes(name)
      ).length
    : 0;
  const filteredArray = entityKey
    ? (data as any)?.[entityKey]?.filter(
        (el: any) =>
          el?.nameAr?.includes(name) || el?.nameEn?.includes(name) || el?.[nameAttr]?.includes(name)
      )
    : [];
  const paginatedArray =
    paginated && entityKey ? filteredArray.slice?.(page * size, page * size + size) : [];
  const paginatedObject = JSON.parse(JSON.stringify(data));
  paginatedObject[entityKey as any] = paginatedArray;
  paginatedObject.results = name && name !== '' ? filteredTotalNoOfRows : paginatedObject.results;

  return async () => {
    await dummyPromise();
    return paginated ? (paginatedObject as T) : (data as T); // usually we want only `data`
  };
}

export type APIResponse<T> = {
  content: T;
  status: 'success' | 'fail';
  results: number;
};
