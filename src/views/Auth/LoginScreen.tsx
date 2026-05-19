import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Container, Link, Paper, TextField, Typography } from '@mui/material';
import { InputPassword } from 'components/common';
import { useLogin } from 'hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type FormValues = z.infer<typeof schema>;

const LoginScreen = () => {
  const { mutate: login, isLoading } = useLogin();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    login(values);
  };

  return (
    <Container maxWidth='sm'>
      <Paper className='space-y-6 p-6'>
        <Typography variant='h5' className='text-center font-bold'>
          Đăng nhập
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <TextField
            {...register('email')}
            fullWidth
            label='Email'
            autoComplete='email'
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                {...field}
                fullWidth
                label='Mật khẩu'
                autoComplete='current-password'
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <LoadingButton type='submit' fullWidth variant='contained' loading={isLoading}>
            Đăng nhập
          </LoadingButton>

          <Typography variant='body2' className='text-center'>
            Chưa có tài khoản?{' '}
            <Link component={RouterLink} to='/auth/register'>
              Đăng ký ngay
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginScreen;
