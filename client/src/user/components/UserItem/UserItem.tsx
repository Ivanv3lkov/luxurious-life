import { Link } from 'react-router-dom';

import Avatar from '../../../shared/components/UIElements/Avatar/Avatar';
import Card from '../../../shared/components/UIElements/Card/Card';
import { useSelector } from 'react-redux';
import { StoreState } from '../../../store';

import './UserItem.css';

type Props = {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  homeCount: number;
  carCount: number;
};

const UserItem: React.FC<Props> = ({ id, image, firstName, lastName, homeCount, carCount }) => {
  const { userId } = useSelector((state: StoreState) => state.user);
  const isMyProfile = userId === id;

  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/items`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:8000/${image}`} alt={firstName} />
          </div>
          <div className="user-item__info">
            <h4 className={isMyProfile? 'my-profile' : ''}>
              {isMyProfile ? '( Me ) - ' : ''}
              {`${firstName} ${lastName}`}
            </h4>
            <h3>
              {homeCount} {homeCount === 1 ? 'Home' : 'Homes'}
            </h3>
            <h3>
              {carCount} {carCount === 1 ? 'Car' : 'Cars'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
