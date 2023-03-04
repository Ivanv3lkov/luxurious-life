import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import UserHomes from './homes/pages/UserHomes';
import NewHome from './homes/pages/NewHome';
// import UserHomes from './places/pages/UserHomes';
// import UpdateHomes from './places/pages/UpdateHome';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/authContext';
import { useAuth } from './shared/hooks/useAuth';


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
        {/* <Route path="/homes/:homeId">
          <UpdateHome />
        </Route> */}
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
