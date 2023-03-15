import Card from '../../shared/components/UIElements/Card/Card';
import CarItem from './CarItem';
import Button from '../../shared/components/FormElements/Button/Button';

import './CarList.css';

export type Car = {
  id: string;
  model: string;
  description: string;
  image: string;
  creator: string;
};

type Props = {
  items: Car[];
  onDeleteCar: (deletedCarId: string) => void;
};

const CarList: React.FC<Props> = ({ items, onDeleteCar }) => {
  if (items.length === 0) {
    return (
      <div className="car-list center">
        <Card>
          <h2>No cars found. Maybe create one?</h2>
          <Button to="/cars/new">Add Car</Button>
        </Card>
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
          description={car.description}
          creatorId={car.creator}
          onDelete={onDeleteCar}
        />
      ))}
    </ul>
  );
};

export default CarList;
