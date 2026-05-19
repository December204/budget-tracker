import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from 'env';
import { enqueueSnackbar } from 'notistack';
import { setAccessToken, signOut } from 'reducers/profileSlice';
import { store } from 'reducers/store';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as string);
  });
  failedQueue = [];
};

const axiosInstance = axios.create({ baseURL: `${API_URL}/sfo-core/api` });

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { isLoggedIn, accessToken }: ProfileType = store.getState().profile;
  if (isLoggedIn && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

axiosInstance.interceptors.response.use(
  ({ data }: AxiosResponse) => data,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_URL}/sfo-core/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken: string = data.token ?? data.accessToken;
        store.dispatch(setAccessToken(newToken));
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(signOut());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message;
    if (message) enqueueSnackbar(message, { variant: 'error' });

    return Promise.reject(error);
  },
);

export default axiosInstance;
