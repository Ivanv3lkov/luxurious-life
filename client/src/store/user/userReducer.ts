import { UserActionTypes, Action } from './userActionTypes';

export interface UserReducerState {
  accessToken: string | null;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserReducerState = {
  accessToken: null,
  userId: null,
  firstName: null,
  lastName: null,
  email: null,
  error: null,
  isLoggedIn: false,
};

export const userReducer = (
  state: UserReducerState = initialState,
  action: Action
): UserReducerState => {
  switch (action.type) {
    case UserActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        userId: action.payload.userId,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        isLoggedIn: true,
        error: null
      };
    case UserActionTypes.AUTH_FAIL:
      return {
        ...state,
        error: action.payload.error
      };
    case UserActionTypes.AUTH_LOGOUT:
      return {
        ...state,
        accessToken: null,
        userId: null,
        firstName: null,
        lastName: null,
        email: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
