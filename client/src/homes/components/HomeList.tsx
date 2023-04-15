import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import Card from '../../shared/components/UIElements/Card/Card';
import HomeItem from './HomeItem';
import Button from '../../shared/components/FormElements/Button/Button';

import './HomeList.css';

export type Home = {
  id: string;
  title: string;
  description: string;
  image: string;
  address: string;
  location: { lat: number; lng: number };
  creator: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
};

type Props = {
  items: Home[];
  onDeleteHome?: (deletedHomeId: string) => void;
};

const HomeList: React.FC<Props> = ({ items, onDeleteHome }) => {
  const urlParams = useParams<{ userId: string }>();
  const { userId } = useSelector((state: StoreState) => state.user);

  if (items.length === 0) {
    return (
      <div className="home-list center">
        <Card>
          {urlParams.userId === userId ? (
            <>
              <h2>No homes found. Maybe create one?</h2>
              <Button to="/homes/new">Add new home</Button>
            </>
          ) : (
            <>
              <h2>No homes found for this user</h2>
              <Button to="/users">Go back</Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <>
      <ul className="home-list">
        {items.map((home: Home) => (
          <HomeItem
            key={home.id}
            id={home.id}
            image={home.image}
            title={home.title}
            creatorId={home.creator}
            reactions={home.reactions}
          />
        ))}
      </ul>
    </>
  );
};

export default HomeList;
