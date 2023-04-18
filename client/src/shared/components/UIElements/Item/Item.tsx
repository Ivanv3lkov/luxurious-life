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

import './Item.css';
import Card from '../Card/Card';

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
  const { error, sendRequest, clearError } = useHttpClient();
  const [{ likes, hearts, diamonds }, setCarReactions] = useState(reactions);
  const isHomeLiked = userId ? likes.includes(userId) : false;
  const isHomeLoved = userId ? hearts.includes(userId) : false;
  const isHomePriceless = userId ? diamonds.includes(userId) : false;

  const reactToHomeHandler = async (buttonText: string) => {
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
      <li className="item">
        <Card className="item__content">
          <div className="item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt="img" />
          </div>
          <div className="item__info">
            <h2>{title ? title : model}</h2>
            <div className="item__info-reactions">
              <FaThumbsUp size={26} />
              <span>{likes.length}</span>
              <FcLike size={30} />
              <span>{hearts.length}</span>
              <IoDiamondSharp size={26} />
              <span>{diamonds.length}</span>
            </div>
          </div>
          <div className="item__actions">
            <div>
              <Button
                onClick={(event: any) => reactToHomeHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                <FaThumbsUp size={15} transform={isHomeLiked ? 'scale(1 -1)' : ''} />
                <span>{isHomeLiked ? 'Unlike' : 'Like'}</span>
              </Button>
              <Button
                onClick={(event: any) => reactToHomeHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                {isHomeLoved ? <FcDislike size={15} /> : <FcLike size={15} />}
                <span>{isHomeLoved ? 'Unlove' : 'Love'}</span>
              </Button>
              <Button
                onClick={(event: any) => reactToHomeHandler(event.currentTarget.textContent)}
                disabled={!userId}
              >
                {isHomePriceless ? <GiDiamondHard size={15} /> : <IoDiamondSharp size={15} />}
                <span>{isHomePriceless ? 'Worthless' : 'Priceless'}</span>
              </Button>
              <Button to={`/${collectionName}/${id}/details`}>DETAILS</Button>
            </div>
          </div>
        </Card>
      </li>
    </>
  );
};

export default Item;
