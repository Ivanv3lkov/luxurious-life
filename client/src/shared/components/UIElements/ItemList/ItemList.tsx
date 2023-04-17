import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from '../../../../store';
import { Car } from '../../../../cars/pages/AllCars';
import { Home } from '../../../../homes/pages/AllHomes';
import Card from '../Card/Card';
import Item from '..//Item/Item';
import Button from '../../FormElements/Button/Button';

import './ItemList.css';

type Props = {
  items: Home[] | Car[];
  collectionName: string;
};

const ItemList: React.FC<Props> = ({ items, collectionName }) => {
  const urlParams = useParams<{ userId: string }>();
  const { userId } = useSelector((state: StoreState) => state.user);

  if (items.length === 0) {
    return (
      <div className="item-list">
        <Card>
          {urlParams.userId === userId ? (
            <>
              <h2>You haven't shared any {collectionName}. Maybe create one?</h2>
              <Button to={`/${collectionName}/new`}>
                Add new {collectionName === 'homes' ? 'home' : 'car'}
              </Button>
            </>
          ) : (
            <>
              <h2>No {collectionName} found!</h2>
              <Button to={urlParams.userId ? `/${urlParams.userId}/items` : `/all-luxuries`}>Go back</Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <ul className="item-list">
      {items.map((item: any) => (
        <Item
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          model={item.model}
          reactions={item.reactions}
          collectionName={collectionName}
        />
      ))}
    </ul>
  );
};

export default ItemList;
