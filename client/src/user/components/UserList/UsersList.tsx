import Card from '../../../shared/components/UIElements/Card/Card';
import { User } from '../../pages/Users';
import UserItem from '../UserItem/UserItem';

import './UsersList.css';

type Props = {
  users: User[];
};

const UsersList: React.FC<Props> = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {users.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          homeCount={user.homes.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
