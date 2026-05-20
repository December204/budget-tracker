import axiosInstance from 'lib/axiosInstance';

const login = (body: LoginBody): Promise<AuthResponse> => axiosInstance.post('/auth/login', body);
const register = (body: RegisterBody): Promise<AuthResponse> =>
  axiosInstance.post('/auth/register', body);
const logout = (): Promise<void> => axiosInstance.post('/auth/logout');
const refresh = (): Promise<RefreshResponse> => axiosInstance.post('/auth/refresh');

const authService = {
  login,
  register,
  logout,
  refresh,
};

export default authService;
