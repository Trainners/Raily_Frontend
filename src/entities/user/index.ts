export type { User, LoginRequest, LoginResponse, SignUpRequest } from './model/types';
export type { UserState, AuthStatus } from './model/userSlice';
export {
    userSlice,
    setCredentials,
    clearCredentials,
    selectAccessToken,
    selectCurrentUser,
    selectAuthStatus,
    selectIsAuthenticated,
} from './model/userSlice';

export { userApi, useLoginMutation, useSignupMutation } from './api'