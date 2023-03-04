import { Link } from 'react-router-dom';

import Avatar from '../../../shared/components/UIElements/Avatar/Avatar';
import Card from '../../../shared/components/UIElements/Card/Card';

import './UserItem.css';

type Props = {
  id: string;
  image: string;
  name: string;
  homeCount: number;
};

const UserItem: React.FC<Props> = ({ id, image, name, homeCount }) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/homes`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:8000/${image}`} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {homeCount} {homeCount === 1 ? 'Home' : 'Homes'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
