import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from './store';
import LuxuryGoods from './all-luxury-items/pages/AllLuxuryItems';
import Profile from './user/pages/Profile';
import UpdateProfile from './user/pages/UpdateProfile';

import AllLuxuryItems from './all-luxury-items/pages/AllLuxuryItems';
import Users from './user/pages/Users';
import UserHomes from './homes/pages/UserHomes';
import UserCars from './cars/pages/UserCars';
import AllHomes from './homes/pages/AllHomes';
import NewHome from './homes/pages/NewHome';
import UpdateHome from './homes/pages/UpdateHome';
import AllCars from './cars/pages/AllCars';
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
         <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/items" exact>
          <LuxuryGoods />
        </Route>
        <Route path="/homes" exact>
          <AllHomes />
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
        <Route path="/cars" exact>
          <AllCars />
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
        <Route path="/:userId/items" exact>
          <Items />
        </Route>
        <Route path="/:userId/profile" exact>
          <Profile />
        </Route>
        <Route path="/:userId/profile/edit" exact>
          <UpdateProfile />
        </Route>
        <Redirect to="/users" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
         <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/items" exact>
          <AllLuxuryItems />
        </Route>
        <Route path="/homes" exact>
          <AllHomes />
        </Route>
        <Route path="/cars" exact>
          <AllCars />
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
      <AuthVerify logOut={logOut} />
    </>
  );
};

export default App;
