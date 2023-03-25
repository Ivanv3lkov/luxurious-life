import { useSelector } from 'react-redux';
import { StoreState } from '../../store';

const Profile = () => {
  const user = useSelector((state: StoreState) => state.user);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{user.firstName} {user.lastName}'s</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Id:</strong> {user.userId}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default Profile;
