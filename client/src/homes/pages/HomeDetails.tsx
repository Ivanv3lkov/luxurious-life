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
import Map from '../../shared/components/UIElements/Map/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import './HomeDetails.css';

const HomeDetails: React.FC = () => {
  const history = useHistory();
  const { homeId } = useParams<{ homeId: string }>();
  const [loadedHome, setLoadedHome] = useState<any>();

  const { userId, accessToken } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  useEffect(() => {
    if (!homeId) {
      return;
    }

    const fetchHome = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/homes/${homeId}`
        );

        setLoadedHome(responseData.home);
      } catch (err) {}
    };
    fetchHome();
  }, [sendRequest, homeId]);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/homes/${homeId}`, 'DELETE', null, {
        Authorization: 'Bearer ' + accessToken
      });
      setLoadedHome({});
      history.push('/' + userId + '/homes');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedHome && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find home!</h2>
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
        header={loadedHome.address}
        contentClass="home-item__modal-content"
        footerClass="home-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={loadedHome?.location || { lat: 30, lng: 60 }} zoom={16} />
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
        <p>Do you want to proceed and delete this home?</p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedHome.title && (
        <Card className="details">
          <div className="details__content">
            <div className="details__image">
              <img src={`${process.env.REACT_APP_ASSET_URL}/${loadedHome.image}`} alt="img" />
            </div>
            <h2>{loadedHome.title}</h2>
            <p>Address: {loadedHome.address}</p>
            <p>Description: {loadedHome.description}</p>
            <div className="details__reactions">
              <FaThumbsUp size={22} />
              {loadedHome.reactions.likes.length}
              <FcLike size={22} />
              {loadedHome.reactions.hearts.length}
              <IoDiamondSharp size={21} />
              {loadedHome.reactions.diamonds.length}
            </div>
            <div className="details__actions">
              {userId === loadedHome.creator && (
                <>
                  <Button onClick={openMapHandler} disabled={!userId} inverse>
                    VIEW ON MAP
                  </Button>
                  <Button to={`/homes/${loadedHome.id}/edit`}>EDIT</Button>
                  <Button danger onClick={showDeleteWarningHandler}>
                    DELETE
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default HomeDetails;
