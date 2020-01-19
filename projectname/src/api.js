import { FetchUtils } from 'mcf-utils'; // package.json中的globals配置不生效

/* global API_PREFIX */ export function fetchList(params) {
  return FetchUtils.fetchList(`${API_PREFIX}/api_prefix`, {
    body: params,
  });
}

export function fetchItem(params) {
  return FetchUtils.fetchGet(`${API_PREFIX}/api_prefix/:id`, {
    body: params,
  });
}

export function fetchSave(params) {
  return FetchUtils.fetchPost(`${API_PREFIX}/api_prefix/:id`, {
    body: params,
  });
}

export function fetchUpdate(params) {
  return FetchUtils.fetchPost(`${API_PREFIX}/api_prefix/:id`, {
    body: params,
  });
}

export function fetchDelete(params) {
  return FetchUtils.fetchPost(`${API_PREFIX}/api_prefix/:id`, {
    body: params,
  });
}
