import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ItemList from '../../shared/components/UIElements/ItemList/ItemList';
import { Car } from './AllCars';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Button from '../../shared/components/FormElements/Button/Button';

import './UserCars.css';

const UserCars: React.FC = () => {
  const [loadedCars, setLoadedCars] = useState<Car[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    setLoadedCars([]);
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cars/user/${userId}`);
        setLoadedCars(responseData.cars);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCars && (
        <>
          {loadedCars.length > 0 && (
            <div className="user-car__btn-add">
              <Button to="/cars/new" size="big">
               Add New Car
              </Button>
            </div>
          )}
          <ItemList items={loadedCars} collectionName='cars' />
        </>
      )}
    </>
  );
};

export default UserCars;
