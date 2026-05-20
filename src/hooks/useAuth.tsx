import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut } from 'reducers/profileSlice';
import { authService, userService } from 'services';
import { REFRESH_TOKEN_KEY } from 'lib/axiosInstance';

const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  return accessToken;
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation(authService.login, {
    onSuccess: async ({ accessToken, refreshToken }: AuthResponse) => {
      storeTokens(accessToken, refreshToken);
      dispatch(signIn({ isLoggedIn: true, accessToken }));
      const user = await userService.getMe();
      dispatch(signIn({ isLoggedIn: true, accessToken, user }));
      enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
      navigate('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? 'Đăng nhập thất bại';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation(authService.register, {
    onSuccess: async ({ accessToken, refreshToken }: AuthResponse) => {
      storeTokens(accessToken, refreshToken);
      dispatch(signIn({ isLoggedIn: true, accessToken }));
      const user = await userService.getMe();
      dispatch(signIn({ isLoggedIn: true, accessToken, user }));
      enqueueSnackbar('Đăng ký thành công', { variant: 'success' });
      navigate('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? 'Đăng ký thất bại';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation(authService.logout, {
    onSettled: () => {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      dispatch(signOut());
      navigate('/auth/login');
    },
  });
};
