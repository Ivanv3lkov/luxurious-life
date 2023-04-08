import { useEffect, useState } from 'react';

import CarList, { Car } from '../../cars/components/CarList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './UserCars.css';

const AllCars: React.FC = () => {
  const [loadedCars, setLoadedCars] = useState<Car[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:8000/api/cars`);
        
        setLoadedCars(responseData.cars);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  const carDeletedHandler = (deletedCarId: string) => {
    setLoadedCars((prevCars) => prevCars.filter((car) => car.id !== deletedCarId));
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCars && (
        <CarList items={loadedCars} onDeleteCar={carDeletedHandler} />
      )}
    </>
  );
};

export default AllCars;
