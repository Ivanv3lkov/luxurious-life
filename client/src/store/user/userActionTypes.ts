import {
  AuthSuccess,
  AuthFail,
  AuthLogout,
  AuthUpdate,
} from './userActions';

export enum UserActionTypes {
  AUTH_START = 'AUTH_START',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAIL = 'AUTH_FAIL',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_UPDATE = 'AUTH_UPDATE',
}

export type Action =
  | AuthSuccess
  | AuthFail
  | AuthLogout
  | AuthUpdate;
