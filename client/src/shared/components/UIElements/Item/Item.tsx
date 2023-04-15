import { useState } from 'react';
import { useSelector } from 'react-redux';

import { FcDislike, FcLike } from 'react-icons/fc';
import { FaThumbsUp } from 'react-icons/fa';
import { IoDiamondSharp } from 'react-icons/io5';
import { GiDiamondHard } from 'react-icons/gi';

import { StoreState } from '../../../../store';
import { useHttpClient } from '../../../../shared/hooks/useHttpClient';
import Button from '../../FormElements/Button/Button';
import ErrorModal from '../ErrorModal/ErrorModal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './Item.css';

export type Props = {
  id: string;
  title?: string;
  model?: string;
  image: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
  collectionName: string;
};

const Item: React.FC<Props> = ({ id, title, model, image, reactions, collectionName }) => {
  const { accessToken, userId } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [{ likes, hearts, diamonds }, setCarReactions] = useState(reactions);
  const isHomeLiked = userId ? likes.includes(userId) : false;
  const isHomeLoved = userId ? hearts.includes(userId) : false;
  const isHomePriceless = userId ? diamonds.includes(userId) : false;

  const reactToHomeHandler = async (buttonText: string) => {
    console.log(collectionName);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/${collectionName}/${id}/reactions`,
        'PATCH',
        JSON.stringify({
          [collectionName === 'homes' ? 'homeId' : 'carId']: id,
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
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="item">
        <div className="item__image">
          <img src={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt="img" />
        </div>
        <div className="item__info">
          <h2>{title ? title : model}</h2>
          <div className="item__reactions">
            <p>
              <FaThumbsUp size={30} />
              {likes.length}
            </p>
            <p>
              <FcLike size={33} />
              {hearts.length}
            </p>
            <p>
              <IoDiamondSharp size={28} />
              {diamonds.length}
            </p>
          </div>
        </div>
        <div className="item__actions">
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
            <Button to={`/${collectionName}/${id}/details`}>DETAILS</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
