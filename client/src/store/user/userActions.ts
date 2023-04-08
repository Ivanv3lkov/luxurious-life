import { UserActionTypes } from './userActionTypes';

export interface User {
  accessToken: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  homesCount: number,
  carsCount: number,
}

interface UserUpdate {
  firstName: string,
  lastName: string,
  homesCount: number,
  carsCount: number,
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

export interface AuthUpdate {
  type: UserActionTypes.AUTH_UPDATE;
  payload: {
    firstName: string,
    lastName: string,
    homesCount: number,
    carsCount: number,
  };
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
      homesCount: user.homesCount,
      carsCount: user.carsCount,
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

export const authUpdate = (user: UserUpdate): AuthUpdate => {  
  return {
    type: UserActionTypes.AUTH_UPDATE,
    payload: {
      firstName: user.firstName,
      lastName: user.lastName,
      homesCount: user.homesCount,
      carsCount: user.carsCount,
    }
  };
};
