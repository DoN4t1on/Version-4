import axios from 'axios';

import { endPoint, localToken } from '../../config/config';

const Api = axios.create({
  baseURL: endPoint,
});

Api.interceptors.request.use((config) => {
  let localData = null;
  try {
    localData =
      JSON.parse(localStorage.getItem(localToken)) ||
      JSON.parse(localStorage.getItem('localdealtoken'));
  } catch {
    localData = null;
  }

  const headers = { ...(config.headers || {}) };

  if (localData?.token) {
    headers.Authorization = `Bearer ${localData.token}`;
  } else {
    delete headers.Authorization;
  }

  if (config.data instanceof FormData) {
    delete headers['Content-Type'];
    delete headers['content-type'];
  } else if (!headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  config.headers = headers;
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default Api;
