import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    isLoggedIn: false,
  } as ProfileType,
  reducers: {
    signIn: (state, { payload }: PayloadAction<ProfileType>) => {
      return { ...payload, isLoggedIn: true };
    },
    signOut: () => {
      return { isLoggedIn: false };
    },
    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
  },
});

export const { signIn, signOut, setAccessToken } = profileSlice.actions;

export const profileSelector = ({ profile }: RootState) => profile;
