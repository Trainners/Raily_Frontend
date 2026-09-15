export type { User, LoginRequest, LoginResponse } from './model/types';
export type { UserState } from './model/userSlice';
export {
    userSlice,
    setCredentials,
    clearCredentials,
    selectAccessToken,
    selectCurrentUser,
    selectIsAuthenticated,
} from './model/userSlice';

export { userApi, useLoginMutation } from './api'