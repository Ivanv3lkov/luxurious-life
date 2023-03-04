import { createContext } from 'react';

type AuthContextType = {
  isLoggedIn: boolean,
  userId: string | null,
  token: string | null,
  login: (uid: string, token: string, expirationDate?: Date) => void,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => null,
  logout: () => null
});
