type LoginBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  id?: number;
  email?: string;
  isAdmin?: boolean;
  username?: string;
  accountInfo?: AccountInfo;
};

type ProfileType = {
  isLoggedIn?: boolean;
  accessToken?: string;
  id?: number;
  email?: string;
  isAdmin?: boolean;
  username?: string;
  accountInfo?: AccountInfo;
};

type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type RegisterResponse = LoginResponse;
