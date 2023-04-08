import { UserActionTypes, Action } from './userActionTypes';

export interface UserReducerState {
  accessToken: string | null;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
  homesCount: number,
  carsCount: number,
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserReducerState = {
  accessToken: null,
  userId: null,
  firstName: null,
  lastName: null,
  email: null,
  image: null,
  homesCount: 0,
  carsCount: 0,
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
        image: action.payload.image,
        homesCount: action.payload.homesCount,
        carsCount: action.payload.carsCount,
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
        image: null,
        email: null,
        homesCount: 0,
        carsCount: 0,
        isLoggedIn: false,
      };
      case UserActionTypes.AUTH_UPDATE:
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName:  action.payload.lastName,
        homesCount: action.payload.homesCount,
        carsCount: action.payload.carsCount,
      };
    default:
      return state;
  }
};
