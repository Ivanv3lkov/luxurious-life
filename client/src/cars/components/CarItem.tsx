import { useState } from 'react';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Card from '../../shared/components/UIElements/Card/Card';
import Button from '../../shared/components/FormElements/Button/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import './CarItem.css';

export type Props = {
  id: string;
  model: string;
  description: string;
  image: string;
  creatorId: string;
  onDelete: (carId: string) => void;
};

const CarItem: React.FC<Props> = ({ id, model, description, image, creatorId, onDelete }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { accessToken, userId } = useSelector((state: StoreState) => state.user);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:8000/api/cars/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + accessToken
      });
      onDelete(id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="car-item__modal-actions"
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
        <p>
          Do you want to proceed and delete this car? Please note that it can't be undone
          thereafter.
        </p>
      </Modal>
      <li className="car-item">
        <Card className="car-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="car-item__image">
            <img src={`http://localhost:8000/${image}`} alt={model} />
          </div>
          <div className="car-item__info">
            <h2>{model}</h2>
            <p>{description}</p>
          </div>
          <div className="car-item__actions">
            {userId === creatorId && <Button to={`/cars/${id}`}>EDIT</Button>}

            {userId === creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default CarItem;
