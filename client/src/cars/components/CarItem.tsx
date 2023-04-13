import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IoDiamondSharp } from 'react-icons/io5';
import { FaThumbsUp } from 'react-icons/fa';
import { FcLike, FcDislike } from 'react-icons/fc';
import { GiDiamondHard } from 'react-icons/gi';

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
  year: number;
  description: string;
  image: string;
  creatorId: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
  onDelete: (carId: string) => void;
};

const CarItem: React.FC<Props> = ({
  id,
  model,
  year,
  description,
  image,
  creatorId,
  reactions,
  onDelete
}) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { accessToken, userId } = useSelector((state: StoreState) => state.user);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [{ likes, hearts, diamonds }, setCarReactions] = useState(reactions);
  const isCarLiked = userId ? likes.includes(userId) : false;
  const isCarLoved = userId ? hearts.includes(userId) : false;
  const isCarPriceless = userId ? diamonds.includes(userId) : false;

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cars/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + accessToken
      });
      onDelete(id);
    } catch (err) {}
  };

  const reactToCarHandler = async (buttonText: string) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cars/${id}/reactions`,
        'PATCH',
        JSON.stringify({
          carId: id,
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
        <p>Do you want to proceed and delete this car?</p>
      </Modal>
      <li className="car-item">
        <Card className="car-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="car-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt="img" />
          </div>
          <div className="car-item__info">
            <h2>{model}</h2>
            <h2>{year}</h2>
            <p>{description}</p>
            <div className="car-item__reactions">
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
          <div className="car-item__actions">
            <div>
              <Button
                onClick={(event: any) => reactToCarHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                <FaThumbsUp size={15} transform={isCarLiked ? 'scale(1 -1)' : ''} />
                {isCarLiked ? 'Unlike' : 'Like'}
              </Button>
              <Button
                onClick={(event: any) => reactToCarHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                {isCarLoved ? <FcDislike size={15} /> : <FcLike size={15} />}
                {isCarLoved ? 'Unlove' : 'Love'}
              </Button>
              <Button
                onClick={(event: any) => reactToCarHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                {isCarPriceless ? <GiDiamondHard size={15} /> : <IoDiamondSharp size={15} />}
                {isCarPriceless ? 'Worthless' : 'Priceless'}
              </Button>
            </div>
            {userId === creatorId && (
              <>
                <Button to={`/cars/${id}`}>EDIT</Button>
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

export default CarItem;
