import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from './store';
import Profile from './user/pages/Profile';
import Users from './user/pages/Users';
import UserHomes from './homes/pages/UserHomes';
import NewHome from './homes/pages/NewHome';
import UpdateHome from './homes/pages/UpdateHome';
import UserCars from './cars/pages/UserCars';
import NewCar from './cars/pages/NewCar';
import UpdateCar from './cars/pages/UpdateCar';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Items from './user/pages/Items';
import { logout } from './store/user/userActions';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import AuthVerify from './shared/hooks/useAuthVerify';

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: StoreState) => state.user);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  
  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/homes" exact>
          <UserHomes />
        </Route>
        <Route path="/homes/new" exact>
          <NewHome />
        </Route>
        <Route path="/homes/:homeId">
          <UpdateHome />
        </Route>
        <Route path="/:userId/cars" exact>
          <UserCars />
        </Route>
        <Route path="/cars/new" exact>
          <NewCar />
        </Route>
        <Route path="/cars/:carId">
          <UpdateCar />
        </Route>
        <Route path="/:userId/all-items" exact>
          <Items />
        </Route>
        <Route path="/:userId/profile" exact>
          <Profile />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <>
      <MainNavigation />
      <main>{routes}</main>
      <AuthVerify logOut={logOut}/>
    </>
  );
};

export default App;
