import { useEffect, useState } from 'react';

import HomeList, { Home } from '../components/HomeList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './UserHomes.css';

const AllHomes: React.FC = () => {
  const [loadedHomes, setLoadedHomes] = useState<Home[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:8000/api/homes`);
        
        setLoadedHomes(responseData.homes);
      } catch (err) {}
    };
    fetchHomes();
  }, [sendRequest]);

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

export default AllHomes;
