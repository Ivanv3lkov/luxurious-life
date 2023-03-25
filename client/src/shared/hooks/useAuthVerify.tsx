import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import { StoreState } from '../../store';

type Props = {
  logOut: () => void;
};

type DecodedJwtToken = {
  email: string,
  exp: number;
  iat: number;
  userId: string;
}

const useAuthVerify: React.FC<Props> = ({ logOut }) => {
  const { accessToken } = useSelector((state: StoreState) => state.user);
  let location = useLocation();
  
  useEffect(() => {
    if (accessToken) {
      const DecodedJwtToken: DecodedJwtToken = jwt_decode(accessToken); 
      
      if (DecodedJwtToken.exp * 1000 < Date.now()) {
        logOut();
      }
    }
  }, [location, logOut, accessToken]);

  return <div></div>;
};

export default useAuthVerify;
