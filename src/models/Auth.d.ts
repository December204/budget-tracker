type LoginBody = {
  email: string;
  password: string;
};

type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

type RefreshResponse = {
  accessToken: string;
};

type ProfileType = {
  isLoggedIn: boolean;
  accessToken?: string;
  user?: UserProfile;
};

type UpdateProfileBody = Partial<Pick<UserProfile, 'firstName' | 'lastName'>>;
