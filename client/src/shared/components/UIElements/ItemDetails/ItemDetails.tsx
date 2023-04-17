import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { FcLike } from 'react-icons/fc';
import { FaThumbsUp } from 'react-icons/fa';
import { IoDiamondSharp } from 'react-icons/io5';

import { StoreState } from '../../../../store/index';
import { useHttpClient } from '../../../hooks/useHttpClient';
import Card from '../Card/Card';
import Button from '../../FormElements/Button/Button';
import Modal from '../Modal/Modal';
import Map from '../Map/Map';
import ErrorModal from '../ErrorModal/ErrorModal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './ItemDetails.css';

const ItemDetails: React.FC = () => {
  const history = useHistory();
  const { homeId, carId } = useParams<{ homeId: string; carId: string }>();
  const [loadedItem, setLoadedItem] = useState<any>();
  const { userId, accessToken } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const isHomeDetails = !!homeId;
  const currentItem = isHomeDetails ? 'home' : 'car';
  const url = `${process.env.REACT_APP_BACKEND_URL}/${
    isHomeDetails ? `homes/${homeId}` : `cars/${carId}`
  }`;

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const responseData = await sendRequest(url);
        setLoadedItem(responseData[currentItem]);
      } catch (err) {}
    };
    fetchItem();
  }, [sendRequest, url, currentItem]);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(url, 'DELETE', null, { Authorization: 'Bearer ' + accessToken });
      setLoadedItem({});
      history.push('/' + userId + (isHomeDetails ? '/homes' : '/cars'));
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedItem && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find {currentItem}!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={loadedItem.address}
        contentClass="item__modal-content"
        footerClass="item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="item__map-container">
          <Map center={loadedItem.location} zoom={16} />
        </div>
      </Modal>
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
        <p>Do you want to proceed and delete this {currentItem}?</p>
      </Modal>
      {!isLoading && loadedItem && (
        <li className="item__details">
          <Card className="item__details-content">
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="item__details-image">
              <img src={`${process.env.REACT_APP_ASSET_URL}/${loadedItem.image}`} alt="img" />
            </div>
            {isHomeDetails ? (
              <>
                <h2>{loadedItem.title}</h2>
                <p>Address: {loadedItem.address}</p>
              </>
            ) : (
              <>
                <h2>{loadedItem.model}</h2>
                <p>Year: {loadedItem.year}</p>
              </>
            )}
            <p>Description: {loadedItem.description}</p>
            <div className="item__details-reactions">
              <FaThumbsUp size={30} />
              <span>{loadedItem.reactions.likes.length}</span>
              <FcLike size={33} />
              <span>{loadedItem.reactions.hearts.length}</span>
              <IoDiamondSharp size={28} />
              <span>{loadedItem.reactions.diamonds.length}</span>
            </div>
            <div className="item__details-actions">
              {userId === loadedItem.creator && (
                <>
                  {isHomeDetails && (
                    <Button onClick={openMapHandler} disabled={!userId} inverse>
                      VIEW ON MAP
                    </Button>
                  )}
                  <Button to={`/${isHomeDetails ? 'homes' : 'cars'}/${loadedItem.id}/edit`}>
                    EDIT
                  </Button>
                  <Button danger onClick={showDeleteWarningHandler}>
                    DELETE
                  </Button>
                </>
              )}
            </div>
          </Card>
        </li>
      )}
    </>
  );
};

export default ItemDetails;
