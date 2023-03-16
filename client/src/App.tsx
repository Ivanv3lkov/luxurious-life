import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
import UserHomes from './homes/pages/UserHomes';
import NewHome from './homes/pages/NewHome';
import UpdateHome from './homes/pages/UpdateHome';
import UserCars from './cars/pages/UserCars';
import NewCar from './cars/pages/NewCar';
import UpdateCar from './cars/pages/UpdateCar';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/authContext';
import { useAuth } from './shared/hooks/useAuth';
import Items from './user/pages/Items';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
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
        <Route path="/:userId/all-user-items" exact>
          <Items />
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
        <Route path="/:userId/homes" exact>
          <UserHomes />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
