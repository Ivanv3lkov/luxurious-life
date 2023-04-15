import { useEffect, useState } from 'react';

import ItemList from '../../shared/components/UIElements/ItemList/ItemList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './UserHomes.css';

export type Home = {
  id: string;
  title: string;
  description: string;
  image: string;
  address: string;
  location: { lat: number; lng: number };
  creator: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
};

const AllHomes: React.FC = () => {
  const [loadedHomes, setLoadedHomes] = useState<Home[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/homes');

        setLoadedHomes(responseData.homes);
      } catch (err) {}
    };
    fetchHomes();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedHomes && <ItemList items={loadedHomes} collectionName='homes'/>}
    </>
  );
};

export default AllHomes;
