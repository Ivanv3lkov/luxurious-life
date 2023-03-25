import {
  AuthSuccess,
  AuthFail,
  AuthLogout,
} from './userActions';

export enum UserActionTypes {
  AUTH_START = 'AUTH_START',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAIL = 'AUTH_FAIL',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
}

export type Action =
  | AuthSuccess
  | AuthFail
  | AuthLogout;
