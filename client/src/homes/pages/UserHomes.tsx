import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import HomeList, { Home } from '../components/HomeList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './UserHomes.css';

const UserHomes: React.FC = () => {
  const [loadedHomes, setLoadedHomes] = useState<Home[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:8000/api/homes/user/${userId}`);
        setLoadedHomes(responseData.homes);
      } catch (err) {}
    };
    fetchHomes();
  }, [sendRequest, userId]);

  const homeDeletedHandler = (deletedHomeId: string) => {
    setLoadedHomes((prevHomes) => prevHomes.filter((home) => home.id !== deletedHomeId));
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedHomes && (
        <HomeList items={loadedHomes} onDeleteHome={homeDeletedHandler} />
      )}
    </>
  );
};

export default UserHomes;
