import { UserActionTypes } from './userActionTypes';

export interface User {
  accessToken: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface AuthSuccess {
  type: UserActionTypes.AUTH_SUCCESS;
  payload: User;
}

export interface AuthFail {
  type: UserActionTypes.AUTH_FAIL;
  payload: { error: string };
}

export interface AuthLogout {
  type: UserActionTypes.AUTH_LOGOUT;
}

export const authSuccess = (user: User): AuthSuccess => {  
  return {
    type: UserActionTypes.AUTH_SUCCESS,
    payload: {
      accessToken: user.accessToken,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
    }
  };
};

export const authFail = (error: string): AuthFail => {
  return {
    type: UserActionTypes.AUTH_FAIL,
    payload: { error }
  };
};

export const logout = (): AuthLogout => {
  return {
    type: UserActionTypes.AUTH_LOGOUT
  };
};
