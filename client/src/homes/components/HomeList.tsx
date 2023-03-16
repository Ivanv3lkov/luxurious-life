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
};

type Props = {
  items: Home[];
  onDeleteHome: (deletedHomeId: string) => void;
};

const HomeList: React.FC<Props> = ({ items, onDeleteHome }) => {  
  if (items.length === 0) {
    return (
      <div className="home-list">
        <Card>
          <h2>No homes found. Maybe create one?</h2>
          <Button to="/homes/new">Add Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="home-list">
      {items.map((home: Home) => (
        <HomeItem
          key={home.id}
          id={home.id}
          image={home.image}
          title={home.title}
          description={home.description}
          address={home.address}
          creatorId={home.creator}
          coordinates={home.location}
          onDelete={onDeleteHome}
        />
      ))}
    </ul>
  );
};

export default HomeList;
