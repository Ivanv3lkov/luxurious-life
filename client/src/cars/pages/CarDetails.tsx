import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { FcLike } from 'react-icons/fc';
import { FaThumbsUp } from 'react-icons/fa';
import { IoDiamondSharp } from 'react-icons/io5';

import { StoreState } from '../../store';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Card from '../../shared/components/UIElements/Card/Card';
import Button from '../../shared/components/FormElements/Button/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import { Car } from '../components/CarList';

import './CarDetails.css';

const CarDetails: React.FC = () => {
  const history = useHistory();
  const { carId } = useParams<{ carId: string }>();
  const [loadedCar, setLoadedCar] = useState<Car>();

  const { userId, accessToken } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  useEffect(() => {
    if (!carId) {
      return;
    }

    const fetchCar = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/cars/${carId}`
        );
        setLoadedCar(responseData.car);
      } catch (err) {}
    };
    fetchCar();
  }, [sendRequest, carId]);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cars/${carId}`, 'DELETE', null, {
        Authorization: 'Bearer ' + accessToken
      });
      history.push('/' + userId + '/cars');
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Do you want to proceed and delete this car?</p>
      </Modal>
      <Card className="details">
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && loadedCar && (
          <div className="details__content">
            <img
              className="details__image"
              src={`${process.env.REACT_APP_ASSET_URL}/${loadedCar.image}`}
              alt="img"
            />
            <h2>Model: {loadedCar.model}</h2>
            <p>Year: {loadedCar.year}</p>
            <p>Description: {loadedCar.description}</p>
            <div className="details__reactions">
              <FaThumbsUp size={22} />
              {loadedCar.reactions.likes.length}
              <FcLike size={22} />
              {loadedCar.reactions.hearts.length}
              <IoDiamondSharp size={21} />
              {loadedCar.reactions.diamonds.length}
            </div>
            <div className="details__actions">
              {userId === loadedCar.creator && (
                <>
                  <Button to={`/cars/${loadedCar.id}/edit`}>EDIT</Button>
                  <Button danger onClick={showDeleteWarningHandler}>
                    DELETE
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default CarDetails;
