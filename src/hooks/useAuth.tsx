import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut } from 'reducers/profileSlice';
import { authService } from 'services';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation(authService.login, {
    onSuccess: ({ token, ...rest }) => {
      dispatch(signIn({ accessToken: token, ...rest }));
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
  const navigate = useNavigate();

  return useMutation(authService.register, {
    onSuccess: () => {
      enqueueSnackbar('Đăng ký thành công, vui lòng đăng nhập', { variant: 'success' });
      navigate('/auth/login');
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
      dispatch(signOut());
      navigate('/auth/login');
    },
  });
};
