import { useParams } from 'react-router-dom';
import { MdHomeWork } from 'react-icons/md';
import { IoCarSportSharp } from 'react-icons/io5';

import Button from '../../shared/components/FormElements/Button/Button';

import './Items.css';

const Items: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="items">
      <div className="items__button">
        <Button to={`/${userId}/homes`} size={'enormous'} inverse>
          <MdHomeWork />
        </Button>
      </div>
      <div className="items__button">
        <Button to={`/${userId}/cars`} size={'enormous'} inverse>
          <IoCarSportSharp />
        </Button>
      </div>
    </div>
  );
};

export default Items;
