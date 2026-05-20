type LoginBody = {
  username: string;
  password: string;
};

type RegisterBody = {
  email: string;
  username: string;
  password: string;
  name?: string;
};

type UserProfile = {
  id: string;
  email: string;
  username: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

type ProfileType = {
  isLoggedIn: boolean;
  accessToken?: string;
  user?: UserProfile;
};

type UpdateProfileBody = {
  name?: string;
};
