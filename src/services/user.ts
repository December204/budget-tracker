import axiosInstance from 'lib/axiosInstance';

const getMe = (): Promise<UserProfile> => axiosInstance.get('/users/me');
const updateMe = (body: UpdateProfileBody): Promise<UserProfile> =>
  axiosInstance.patch('/users/me', body);

const userService = {
  getMe,
  updateMe,
};

export default userService;
