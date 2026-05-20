import axiosInstance, { REFRESH_TOKEN_KEY } from 'lib/axiosInstance';

const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';

const login = (body: LoginBody): Promise<AuthResponse> => axiosInstance.post('/auth/login', body);

const register = (body: RegisterBody): Promise<AuthResponse> => axiosInstance.post('/auth/register', body);

const refresh = (): Promise<RefreshResponse> =>
  axiosInstance.post('/auth/refresh', { refreshToken: getStoredRefreshToken() });

const logout = (): Promise<void> =>
  axiosInstance.post('/auth/logout', { refreshToken: getStoredRefreshToken() });

const authService = {
  login,
  register,
  refresh,
  logout,
};

export default authService;
