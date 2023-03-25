import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { StoreState } from '../../../store';
import { logout } from '../../../store/user/userActions';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdHomeWork } from 'react-icons/md';
import { IoIosPeople } from 'react-icons/io';
import { IoCarSportSharp } from 'react-icons/io5';
import { SiGnuprivacyguard } from 'react-icons/si';
import { CgProfile } from 'react-icons/cg';

import './NavLinks.css';

const NavLinks: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userId } = useSelector((state: StoreState) => state.user);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact className="nav-links__li">
          <IoIosPeople />
          <span>All Users</span>
        </NavLink>
      </li>
      {isLoggedIn && (
        <>
          <li>
            <NavLink to={`/${userId}/homes`} className="nav-links__li">
              <MdHomeWork />
              <span>My Homes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/${userId}/cars`} className="nav-links__li">
              <IoCarSportSharp />
              <span>My Cars</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/${userId}/profile`} className="nav-links__li">
              <CgProfile />
              <span>Profile</span>
            </NavLink>
          </li>
          <li>
            <button onClick={() => dispatch(logout())} className="nav-links__li">
              <AiOutlineLogout /> <span>Logout</span>
            </button>
          </li>
        </>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth" className="nav-links__li">
            <SiGnuprivacyguard />
            <span>Authenticate</span>
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
