import { useEffect, useState } from 'react';

import UsersList from '../components/UserList/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

export type User = {
  email: string;
  homes: object[];
  cars: object[];
  image: string;
  id: string;
  firstName: string;
  lastName: string;
  _id: string;
};

const Users: React.FC = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');
        setLoadedUsers(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList users={loadedUsers} />}
    </>
  );
};

export default Users;
