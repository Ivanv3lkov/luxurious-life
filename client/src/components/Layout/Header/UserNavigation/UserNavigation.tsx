import { Link } from 'react-router-dom';

const UserNavigation = () => {
  const user = {
    _id: '12345'
  };
  return (
    <>
     <li className="nav_item">
        <Link to={`/`}>Properties For Sale</Link>
      </li>
      <li className="nav_item">
        <Link to={`/profile/${user._id}/sell-property`}>Sell My Property</Link>
      </li>
      <li className="nav_item">
        <Link to={`/profile/${user._id}`}>Profile</Link>
      </li>
      <li className="nav_item">
        <Link to="/auth/logout">Logout</Link>
      </li>
    </>
  );
};

export default UserNavigation;
