import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AiOutlineLogout } from 'react-icons/ai';

import { AuthContext } from '../../context/authContext';

import './NavLinks.css';

const NavLinks: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/homes`}>My Homes</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/homes/new">Add Home</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout} className="nav-links__logout_btn">
            <AiOutlineLogout size={20} /> <span className="nav-links__logout_btn_span">Logout</span>
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
