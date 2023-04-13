import { useState } from 'react';
import { useSelector } from 'react-redux';

import { FcDislike, FcLike } from 'react-icons/fc';
import { FaThumbsUp } from 'react-icons/fa';
import { IoDiamondSharp } from 'react-icons/io5';
import { GiDiamondHard } from 'react-icons/gi';

import { StoreState } from '../../store';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Card from '../../shared/components/UIElements/Card/Card';
import Button from '../../shared/components/FormElements/Button/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import Map from '../../shared/components/UIElements/Map/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import './HomeItem.css';

export type Props = {
  id: string;
  title: string;
  description: string;
  image: string;
  address: string;
  coordinates: { lat: number; lng: number };
  creatorId: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
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
  reactions,
  onDelete
}) => {
  const { accessToken, userId } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [{ likes, hearts, diamonds }, setCarReactions] = useState(reactions);
  const isHomeLiked = userId ? likes.includes(userId) : false;
  const isHomeLoved = userId ? hearts.includes(userId) : false;
  const isHomePriceless = userId ? diamonds.includes(userId) : false;

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/homes/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + accessToken
      });
      onDelete(id);
    } catch (err) {}
  };

  const reactToHomeHandler = async (buttonText: string) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/homes/${id}/reactions`,
        'PATCH',
        JSON.stringify({
          homeId: id,
          currentReaction: buttonText
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      );

      setCarReactions(responseData.reactions);
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
        <p>Do you want to proceed and delete this home?</p>
      </Modal>
      <li className="home-item">
        <Card className="home-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="home-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt="img" />
          </div>
          <div className="home-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
            <div className="home-item__reactions">
              <h3>
                <FaThumbsUp size={22} />
                {likes.length}
              </h3>
              <h3>
                <FcLike size={22} />
                {hearts.length}
              </h3>
              <h3>
                <IoDiamondSharp size={21} />
                {diamonds.length}
              </h3>
            </div>
          </div>
          <div className="home-item__actions">
            <div>
              <Button
                onClick={(event: any) => reactToHomeHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                <FaThumbsUp size={15} transform={isHomeLiked ? 'scale(1 -1)' : ''} />
                {isHomeLiked ? 'Unlike' : 'Like'}
              </Button>
              <Button
                onClick={(event: any) => reactToHomeHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                {isHomeLoved ? <FcDislike size={15} /> : <FcLike size={15} />}
                {isHomeLoved ? 'Unlove' : 'Love'}
              </Button>
              <Button
                onClick={(event: any) => reactToHomeHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                {isHomePriceless ? <GiDiamondHard size={15} /> : <IoDiamondSharp size={15} />}
                {isHomePriceless ? 'Worthless' : 'Priceless'}
              </Button>
            </div>
            <Button onClick={openMapHandler} disabled={!userId} inverse>
              VIEW ON MAP
            </Button>
            {userId === creatorId && (
              <>
                <Button to={`/homes/${id}`}>EDIT</Button>
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default HomeItem;
