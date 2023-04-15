import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Home } from './AllHomes';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './UserHomes.css';
import ItemList from '../../shared/components/UIElements/ItemList/ItemList';

const UserHomes: React.FC = () => {
  const [loadedHomes, setLoadedHomes] = useState<Home[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/homes/user/${userId}`);
        setLoadedHomes(responseData.homes);
      } catch (err) {}
    };
    fetchHomes();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedHomes && (
        <>
          {loadedHomes.length > 0 && (
            <div className="item-btn-add">
              <Button to="/homes/new" size="big">
                Add New Home
              </Button>
            </div>
          )}
          <ItemList items={loadedHomes} collectionName='homes' />
        </>
      )}
    </>
  );
};

export default UserHomes;
