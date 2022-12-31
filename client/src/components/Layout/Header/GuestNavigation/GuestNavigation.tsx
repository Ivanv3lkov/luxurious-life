import { Link } from 'react-router-dom';

const GuestNavigation: React.FC = () => {
  return (
    <>
      <li className="nav_item">
        <Link to={`/`}>Properties For Sale</Link>
      </li>
      <li className="nav_item">
        <Link to={`/auth/login`}>Sell Property</Link>
      </li>
      <li className="nav_item">
        <Link to="/auth/login">Login</Link>
      </li>
    </>
  );
};

export default GuestNavigation;
