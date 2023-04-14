import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import Card from '../../shared/components/UIElements/Card/Card';
import CarItem from './CarItem';
import Button from '../../shared/components/FormElements/Button/Button';

import './CarList.css';
import { useParams } from 'react-router-dom';

export type Car = {
  id: string;
  model: string;
  year: number;
  description: string;
  image: string;
  creator: string;
  reactions: {
    likes: string[];
    hearts: string[];
    diamonds: string[];
  };
};

type Props = {
  items: Car[];
  onDeleteCar?: (deletedCarId: string) => void;
};

const CarList: React.FC<Props> = ({ items, onDeleteCar }) => {
  const urlParams = useParams<{ userId: string }>();
  const { userId } = useSelector((state: StoreState) => state.user);

  if (items.length === 0) {
    return (
      <div className="car-list center">
        {urlParams.userId === userId ? (
          <Card>
            <h2>No cars found. Maybe create one?</h2>
            <Button to="/cars/new">Add new car</Button>
          </Card>
        ) : (
          <Card>
            <h2>No cars found for this user</h2>
            <Button to="/users">Go back</Button>
          </Card>
        )}
      </div>
    );
  }

  return (
    <ul className="car-list">
      {items.map((car: Car) => (
        <CarItem
          key={car.id}
          id={car.id}
          image={car.image}
          model={car.model}
          year={car.year}
          description={car.description}
          creatorId={car.creator}
          reactions={car.reactions}
          onDelete={onDeleteCar ? onDeleteCar : () => console.log('delete car') }
        />
      ))}
    </ul>
  );
};

export default CarList;
