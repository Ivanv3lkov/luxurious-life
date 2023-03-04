import { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card/Card';
import Button from '../../shared/components/FormElements/Button/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import Map from '../../shared/components/UIElements/Map/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { AuthContext } from '../../shared/context/authContext';
import { useHttpClient } from '../../shared/hooks/useHttpClient';

import './HomeItem.css';

export type Props = {
  id: string;
  title: string;
  description: string;
  image: string;
  address: string;
  coordinates: { lat: number; lng: number };
  creatorId: string;
  onDelete: (homeId: string) => void;
};

const HomeItem: React.FC<Props> = ({
  id,
  title,
  description,
  image,
  address,
  coordinates,
  creatorId,
  onDelete
}) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:8000/api/homes/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token
      });
      onDelete(id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="home-item__modal-content"
        footerClass="home-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="home-item__modal-actions"
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
          Do you want to proceed and delete this home? Please note that it can't be undone
          thereafter.
        </p>
      </Modal>
      <li className="home-item">
        <Card className="home-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="home-item__image">
            <img src={`http://localhost:8000/${image}`} alt={title} />
          </div>
          <div className="home-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="home-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === creatorId && <Button to={`/homes/${id}`}>EDIT</Button>}

            {auth.userId === creatorId && (
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

export default HomeItem;
