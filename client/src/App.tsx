import React, { Suspense, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import { StoreState } from './store';
import { logout } from './store/user/userActions';

import AuthVerify from './shared/hooks/useAuthVerify';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import MainNavigation from './shared/components/Navigation/MainNavigation';

const Profile = React.lazy(() => import('./user/pages/Profile'));
const UpdateProfile = React.lazy(() => import('./user/pages/UpdateProfile'));
const AllLuxuryItems = React.lazy(() => import('./all-luxury-items/AllLuxuryItems'));
const Users = React.lazy(() => import('./user/pages/Users'));
const UserHomes = React.lazy(() => import('./homes/pages/UserHomes'));
const UserCars = React.lazy(() => import('./cars/pages/UserCars'));
const AllHomes = React.lazy(() => import('./homes/pages/AllHomes'));
const NewHome = React.lazy(() => import('./homes/pages/NewHome'));
const UpdateHome = React.lazy(() => import('./homes/pages/UpdateHome'));
const AllCars = React.lazy(() => import('./cars/pages/AllCars'));
const NewCar = React.lazy(() => import('./cars/pages/NewCar'));
const UpdateCar = React.lazy(() => import('./cars/pages/UpdateCar'));
const Auth = React.lazy(() => import('./user/pages/Auth'));
const Items = React.lazy(() => import('./user/pages/Items'));

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
          <AllLuxuryItems />
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
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
      <AuthVerify logOut={logOut} />
    </>
  );
};

export default App;
