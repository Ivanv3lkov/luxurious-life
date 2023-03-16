import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AiOutlineLogout } from 'react-icons/ai';
import { MdHomeWork } from 'react-icons/md';
import { IoIosPeople } from 'react-icons/io';
import { IoCarSportSharp } from 'react-icons/io5';
import { SiGnuprivacyguard } from 'react-icons/si';

import { AuthContext } from '../../context/authContext';

import './NavLinks.css';

const NavLinks: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact className="nav-links__li">
          <IoIosPeople />
          <span>All Users</span>
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/homes`} className="nav-links__li">
            <MdHomeWork />
            <span>My Homes</span>
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/cars`} className="nav-links__li">
            <IoCarSportSharp />
            <span>My Cars</span>
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" className="nav-links__li">
            <SiGnuprivacyguard />
            <span>Authenticate</span>
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout} className="nav-links__li">
            <AiOutlineLogout /> <span>Logout</span>
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
