import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Container, Link, Paper, TextField, Typography } from '@mui/material';
import { InputPassword } from 'components/common';
import { useRegister } from 'hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';

const schema = z
  .object({
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    firstName: z.string().min(1, 'Vui lòng nhập họ'),
    lastName: z.string().min(1, 'Vui lòng nhập tên'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const RegisterScreen = () => {
  const { mutate: register, isLoading } = useRegister();

  const {
    register: registerField,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirmPassword: _, ...values }: FormValues) => {
    register(values);
  };

  return (
    <Container maxWidth='sm'>
      <Paper className='space-y-6 p-6'>
        <Typography variant='h5' className='text-center font-bold'>
          Đăng ký
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <TextField
            {...registerField('email')}
            fullWidth
            label='Email'
            autoComplete='email'
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <div className='flex gap-4'>
            <TextField
              {...registerField('firstName')}
              fullWidth
              label='Họ'
              autoComplete='family-name'
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              {...registerField('lastName')}
              fullWidth
              label='Tên'
              autoComplete='given-name'
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </div>

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                {...field}
                fullWidth
                label='Mật khẩu'
                autoComplete='new-password'
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                {...field}
                fullWidth
                label='Xác nhận mật khẩu'
                autoComplete='new-password'
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <LoadingButton type='submit' fullWidth variant='contained' loading={isLoading}>
            Đăng ký
          </LoadingButton>

          <Typography variant='body2' className='text-center'>
            Đã có tài khoản?{' '}
            <Link component={RouterLink} to='/auth/login'>
              Đăng nhập
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterScreen;
