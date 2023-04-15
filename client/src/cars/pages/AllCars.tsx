import { useEffect, useState } from 'react';

import ItemList from '../../shared/components/UIElements/ItemList/ItemList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './UserCars.css';

export type Car = {
  id: string;
  model: string;
  year: number;
  description: string;
  image: string;
  creator: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
};

const AllCars: React.FC = () => {
  const [loadedCars, setLoadedCars] = useState<Car[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/cars');

        setLoadedCars(responseData.cars);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCars && <ItemList items={loadedCars} collectionName='cars'/>}
    </>
  );
};

export default AllCars;
