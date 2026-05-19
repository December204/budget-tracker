import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import { default as storage } from 'redux-persist/lib/storage';
import { profileSlice } from './profileSlice';
import { themeSlice } from './themeSlice';

// Exclude accessToken from localStorage to prevent XSS token theft.
// The access token lives only in memory; a new one is fetched via
// the httpOnly refresh-cookie on every page load.
const stripAccessToken = createTransform<ProfileType, Omit<ProfileType, 'accessToken'>>(
  ({ accessToken: _, ...rest }) => rest,
  (state) => state,
  { whitelist: ['profile'] },
);

const rootReducer = combineReducers({
  [profileSlice.name]: profileSlice.reducer,
  [themeSlice.name]: themeSlice.reducer,
});

const persistedReducer = persistReducer(
  { key: 'root', storage, transforms: [stripAccessToken] },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
