import { NODE_ENV, uri } from '@/constants/environment-variables';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: uri[NODE_ENV]
});

const api = (axios: AxiosInstance) => {
  return {
    get: function <T>(url: string, config: AxiosRequestConfig = {}) {
      return axios.get<T>(url, config);
    }
  };
};

export default api(axiosInstance);
